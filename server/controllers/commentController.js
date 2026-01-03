const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.status(200).json({ data: { comments } });
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};
exports.getCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
};

exports.createComment = async (req, res) => {
  const data = req.body;
  try {
    const comment = await prisma.comment.create({ data });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create comment' });
  }
};


exports.getCommentsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Vérifier que le livre existe (optionnel mais conseillé)
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!book) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }

    // Récupérer tous les commentaires liés au livre
    const comments = await prisma.comment.findMany({
      where: { bookId },
      //orderBy: { date: "desc" } // optionnel : du plus récent au plus ancien
    });

    res.json(comments);
  } catch (error) {
    console.error("Erreur récupération commentaires:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const comment = await prisma.comment.update({ where: { id }, data });
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update comment' });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.comment.delete({ where: { id } });
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete comment' });
  }
};
