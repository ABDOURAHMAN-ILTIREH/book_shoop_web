// controllers/cartItemController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer ou mettre à jour un item dans le panier
exports.createCartItem = async (req, res) => {
  try {
    const { userId, bookId, quantity } = req.body;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier que le livre existe
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    if (book.stock < quantity) {
      return res.status(400).json({ error: 'Stock insuffisant' });
    }

    // Vérifier si l'article existe déjà dans le panier
    const existingCartItem = await prisma.cartItem.findFirst({
      where: { userId, bookId },
    });

    let cartItem;

    if (existingCartItem) {
      // Incrémenter la quantité
      const newQuantity = existingCartItem.quantity + quantity;

      if (book.stock < newQuantity) {
        return res.status(400).json({ error: 'Stock insuffisant pour la quantité totale' });
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Créer un nouvel item
      cartItem = await prisma.cartItem.create({
        data: { userId, bookId, quantity },
      });
    }

    res.status(201).json(cartItem);

  } catch (error) {
    console.error('Erreur lors de l’ajout au panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};



// Récupérer tous les items du panier
exports.getAllCartItems = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      include: { book: true, user: true },
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Erreur lors de la récupération des cart items:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer tous les cart items de l'utilisateur connecté
exports.getMyCartItems = async (req, res) => {
  try {
    const userId = req.user.id; // utilisateur connecté

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: userId,
      },
      include: {
        book: true, // infos du livre
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // 1️⃣ Vérifier que le cart item existe
    const existingCartItem = await prisma.cartItem.findUnique({
      where: { id }
    });

    if (!existingCartItem) {
      return res.status(404).json({ error: "CartItem non trouvé" });
    }
   
    // 4️⃣ Update cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    res.status(200).json(updatedCartItem);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du cart item:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Supprimer un item du panier
exports.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.cartItem.delete({
      where: { id },
    });

    res.status(200).json({ message: 'CartItem supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du cart item:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params; // id de l'utilisateur

    // Supprime tous les cartItems pour cet utilisateur
    await prisma.cartItem.deleteMany({
      where: { userId: userId },
    });

    res.status(200).json({ message: 'Panier vidé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
