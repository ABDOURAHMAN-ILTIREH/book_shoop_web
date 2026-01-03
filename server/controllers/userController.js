const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /users?page=1&limit=20
exports.getAllUsers = async (req, res) => {
  try {
    // --- Pagination ---
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 20;
    const skip = (page - 1) * limit;

    // --- Fetch users + total ---
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count(),
    ]);

    // --- Response (standardisée) ---
    res.status(200).json({
      success: true,
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Erreur getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
};


// GET /users/search?query=...
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Paramètre de recherche manquant" });

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { email: { contains: q} }
        ]
      },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json(users);
  } catch (error) {
    console.error("Erreur searchUsers:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /users/role/:role
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await prisma.user.findMany({
      where: { role },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(users);
  } catch (error) {
    console.error("Erreur getUsersByRole:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /users/:id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true,phone:true,location:true, role: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    console.error("Erreur getUserById:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /users/:id/orders
exports.getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await prisma.order.findMany({
      where: { userId: id },
      include: {
        items: { include: { book: true } },
        shippingAddress: true
      }
    });
    res.json(orders);
  } catch (error) {
    console.error("Erreur getUserOrders:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /users/:id/comments
exports.getUserComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await prisma.comment.findMany({
      where: { userId: id },
      include: { book: { select: { id: true, title: true } } }
    });
    res.json(comments);
  } catch (error) {
    console.error("Erreur getUserComments:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Me
exports.me = async (req, res) => {
   res.set('Cache-Control', 'no-store');
  try { 
     user = req.user;
 
    if (!user) {
      return res.status(401).json({ success: false, message: "Utilisateur non authentifié" });
    }
    res.json({data: {
      user
    }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'utilisateur",
      error: error.message
    })};
};


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const  {name,phone,location} = req.body;

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data:{
        name:name,
        phone:phone,
        location:location,
      }
    });

    // 🔹 Recharger les données complètes après mise à jour
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Mettre à jour un utilisateur par ID
exports.updateUser = async  (req, res) => {
  try {
    const { id } = req.params; // ID de l'utilisateur à mettre à jour
    const { name, email, phone, location,role } = req.body; // champs à mettre à jour

    // Vérifier que l'utilisateur existe
     const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? existingUser.name,
        email: email ?? existingUser.email,
        phone: phone ?? existingUser.phone,
        location: location ?? existingUser.location,
        role: role ?? existingUser.role,
        updatedAt: new Date(), // si tu as un champ updatedAt
      },
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error('Erreur update user:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteUser = async  (req, res) => {
   try {
      const {id} = req.params;

    // 1️⃣ Vérifier si le livre existe
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    // 2️⃣ Supprimer les dépendances si les modèles existent
    if (prisma.order) await prisma.order.deleteMany({ where: { userId: id } });
    if (prisma.cart) await prisma.cart.deleteMany({ where: { userId: id } });
    if (prisma.comment) await prisma.comment.deleteMany({ where: { userId: id } });


     const deleteUser = await prisma.user.delete({
      where:{id},
     });
  

     return res.status(200).json({message:"l'utilisateur supprime avec success."},deleteUser);
    
   } catch (error) {
      console.error('Erreur update user:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
   }
}