const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token; // Récupération du token depuis les cookies

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
  
    const user = await prisma.user.findUnique({
      where: { id: decoded._id },
    });
 
    req.user = user; // On stocke l'objet utilisateur complet
    next();

  } catch (error) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Échec de l'authentification." });
  }
};

function authorizeAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: "Access denied. Admin only." });
  }

  next();
}

module.exports = { authenticateToken, authorizeAdmin };
