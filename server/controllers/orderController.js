const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// controllers/order.controller.js

exports.getAllOrders = async (req, res) => {
  try {
    // 🔐 Sécurité (ADMIN uniquement)
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    // --- Pagination ---
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 20;
    const skip = (page - 1) * limit;

    // --- Fetch orders + count ---
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        include: {
          items: true,
          shippingAddress: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // ✅ cohérent avec le front
        },
      }),
      prisma.order.count(),
    ]);

    // --- Response (même structure que books) ---
    res.status(200).json({
      success: true,
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
};




exports.createOrder = async (req, res) => {
  try {
    const { userId, customerName, total, status, shippingAddress, items } = req.body;

    if (!userId || !shippingAddress || !items?.length) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Validate stock
      for (const item of items) {
        const book = await tx.book.findUnique({
          where: { id: item.bookId },
        });

        if (!book) {
          throw new Error(`Livre introuvable: ${item.bookId}`);
        }

        if (book.stock < item.quantity) {
          throw new Error(
            `Stock insuffisant pour "${book.title}" (disponible: ${book.stock})`
          );
        }
      }


      // 3️⃣ Create shipping address
      const shipping = await tx.shippingAddress.create({
        data: shippingAddress,
      });

      // 4️⃣ Create order
      const order = await tx.order.create({
        data: {
          userId,
          customerName,
          total,
          status,
          shippingAddressId: shipping.id,
        },
      });

      // 5️⃣ Create order items
      const orderItemsData = items.map(item => ({
        orderId: order.id,
        bookId: item.bookId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      // 6️⃣ Return full order
      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: true,
          shippingAddress: true,
        },
      });
    });

    res.status(201).json(result);

  } catch (error) {
    console.error('Erreur création commande:', error.message);
    res.status(400).json({ error: error.message });
  }
};


// Récupérer toutes les commandes de l'utilisateur (ex: via token ou param userId)

exports.getMyOrders = async (req, res) => {
  try {
    // Supposons que userId est dans req.user.id (middleware auth)
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Non autorisé" });

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true, shippingAddress: true },
      orderBy: { createdAt: 'desc' },
    });
     

    res.json({ data: { orders } });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer une commande par son ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, shippingAddress: true },
    });

    if (!order) return res.status(404).json({ error: "Commande non trouvée" });

    res.json(order);
  } catch (error) {
    console.error("Erreur récupération commande:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer commandes par statut
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const orders = await prisma.order.findMany({
      where: { status },
      include: { items: true, shippingAddress: true },
      orderBy: { date: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error("Erreur récupération commandes par statut:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour le statut d'une commande
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: "Statut requis" });

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("Erreur mise à jour statut:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Statistiques simples : nombre commandes par statut
exports.getOrderStats = async (req, res) => {
  try {
    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

    const counts = await Promise.all(
      statuses.map(async (status) => ({
        status,
        count: await prisma.order.count({ where: { status } }),
      }))
    );

    res.json(counts);
  } catch (error) {
    console.error("Erreur statistiques commandes:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Recherche commandes par plage de date ?start=YYYY-MM-DD&end=YYYY-MM-DD
exports.getOrdersByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: "Paramètres start et end requis" });
    }

    const orders = await prisma.order.findMany({
      where: {
        date: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
      include: { items: true, shippingAddress: true },
      orderBy: { date: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error("Erreur recherche date commandes:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {

      // 1️⃣ Récupérer la commande + items
      const order = await tx.order.findUnique({
        where: { id },
        select: {
          items: {
            select: {
              bookId: true,
              quantity: true
            }
          }
        }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // 2️⃣ Restaurer le stock
      for (const item of order.items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }

      // 3️⃣ Supprimer les OrderItems
      await tx.orderItem.deleteMany({
        where: { orderId: id }
      });

      // 4️⃣ Supprimer la commande
      await tx.order.delete({
        where: { id }
      });

      // 5️⃣ Supprimer les ShippingAddress ORPHELINES
      await tx.shippingAddress.deleteMany({
        where: {
          orders: {
            none: {}
          }
        }
      });
    });

    res.json({
      message: 'Order deleted and orphan shipping addresses cleaned successfully'
    });

  } catch (error) {
    console.error('Erreur suppression commande:', error);
    res.status(500).json({ error: error.message });
  }
};

