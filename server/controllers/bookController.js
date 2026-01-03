const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Créer un livre
exports.createBook = async (req, res) => {
  try {
    let { 
      title,
      author,
      price,
      originalPrice,
      category,
      language,
      stock,
      rating,
      totalRatings,
      description,
      image,
      featured,
      isNew
     } = req.body;

    if (!title || !author || !price == null) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }
    
    const book = await prisma.book.create({
      data: { title, author, price,  originalPrice,language, category, stock,rating,totalRatings, featured, description,image,isNew },
    });

    res.status(200).json(book);
  } catch (error) {
    console.error("Erreur création livre:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer tous les livres
exports.getAllBooks = async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(books);
  } catch (error) {
    console.error("Erreur récupération livres:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer un livre par ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: { comments: true },
    });

    if (!book) return res.status(404).json({ error: "Livre non trouvé" });

    res.json(book);
  } catch (error) {
    console.error("Erreur récupération livre:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour un livre
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
      const {
      title,
      author,
      price,
      originalPrice,
      category,
      language,
      stock,
      rating,
      totalRatings,
      description,
      image,
      featured,
      isNew,
    } = req.body;

    // Vérifier que le livre existe
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });
    if (req.file) {
       image = req.file.filename;
    }

    if (!existingBook) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }
    const updatedBook = await prisma.book.update({
      where: { id },
      data:{
        title,
        author,
        price,
        originalPrice,
        category,
        language,
        stock,
        description,
        rating,
        totalRatings,
        featured,
        image,
        isNew,
      }
    });

    res.json(updatedBook);
  } catch (error) {
    console.error("Erreur mise à jour livre:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Supprimer un livre

exports.deleteBook = async (req, res) => {
  try {
    const {id} = req.params;

    // 1️⃣ Vérifier si le livre existe
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // 2️⃣ Supprimer les dépendances si les modèles existent
    if (prisma.orderItem) await prisma.orderItem.deleteMany({ where: { bookId: id } });
    if (prisma.cart) await prisma.cart.deleteMany({ where: { bookId: id } });
    if (prisma.comment) await prisma.comment.deleteMany({ where: { bookId: id } });

    // 3️⃣ Supprimer le livre
    await prisma.book.delete({ where: { id } });

    // 4️⃣ Supprimer l'image du serveur si elle existe
    if (book.image) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(book.image));
      fs.unlink(imagePath, (err) => {
        if (err) console.warn('Failed to delete image file:', err.message);
      });
    }

    res.status(200).json({ message: 'Book deleted successfully' });

  } catch (error) {
    console.error('Erreur suppression livre:', error);

    // Gestion des contraintes de clé étrangère
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete book, it is used in other records' });
    }

    res.status(500).json({ error: 'Server error' });
  }
};



// Récupérer les livres en vedette
exports.getFeaturedBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({data:{books}});
  } catch (error) {
    console.error("Erreur récupération featured books:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// Récupérer les livres en vedette
exports.getNewBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: { isNew: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({data:{books}});
  } catch (error) {
    console.error("Erreur récupération nouveaux books:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Rechercher des livres
exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.status(400).json({ error: "Paramètre q requis" });

    const books = await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { author: { contains: q } },
        { category: { contains: q } },
      ],
      },
    });

    res.json(books);
  } catch (error) {
    console.error("Erreur recherche livres:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Filtrer par catégorie
exports.getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const books = await prisma.book.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
    });

    res.json(books);
  } catch (error) {
    console.error("Erreur récupération livres par catégorie:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer le stock d’un livre
exports.getBookStock = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id },
      select: { stock: true },
    });

    if (!book) return res.status(404).json({ error: "Livre non trouvé" });

    res.json({ stock: book.stock });
  } catch (error) {
    console.error("Erreur récupération stock:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.updateMultipleBookStock = async (req, res) => {
  try {
    const {id} = req.params
    const {  quantity } = req.body; // items: [{ bookId, quantity }]

    if (!id || quantity == null) {
      return res.status(400).json({ error: "bookId et quantity requis" });
    }


    const book = await prisma.book.findUnique({ where: { id: id } });
    if (!book) {
      return res.status(404).json({ error: `Livre avec ID ${id} non trouvé` });
    }

    const newStock = book.stock - quantity;
    if (newStock < 0) {
      return res.status(400).json({ error: `Stock insuffisant pour ${book.title}` });
    }

    const updated = await prisma.book.update({
        where: { id: id },
        data: { stock: newStock },
    });


    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stock:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


// Récupérer les commentaires d’un livre
exports.getBookComments = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await prisma.comment.findMany({
      where: { bookId: id },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true } } },
    });

    res.json({ data: { comments } });
  } catch (error) {
    console.error("Erreur récupération commentaires:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


exports.getBooks = async (req, res) => {
  try {
    // --- Pagination ---
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 20;
    const skip = (page - 1) * limit;

    // --- Filters ---
    const { title, author, category, minPrice, maxPrice, search } = req.query;
    const filters = [];

    if (title) filters.push({ title: { contains: title} });
    if (author) filters.push({ author: { contains: author } });
    if (category) {
      filters.push(
        Array.isArray(category)
          ? { category: { in: category } }
          : { category: category }
      );
    }
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice && !isNaN(minPrice)) priceFilter.gte = Number(minPrice);
      if (maxPrice && !isNaN(maxPrice)) priceFilter.lte = Number(maxPrice);
      filters.push({ price: priceFilter });
    }
    if (search) {
      filters.push({
        OR: [
          { title: { contains: search} },
          { author: { contains: search } },
        ]
      });
    }

    const where = filters.length ? { AND: filters } : {};

    // --- Fetch books ---
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.book.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: books,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch books' });
  }
};



