const { hash, compare} = require("../utils/password.bcrypt");
const { create_Token } = require("../utils/token");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password,phone,location,role} = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Tous les champs sont requis" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(409).json({ error: "Cet email est déjà utilisé" });

    const hashedPassword = hash(password);

   const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role,phone,location},
    });
   
    const token = create_Token(user.id);

      // Set cookie instead of using session
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });


    res.status(201).json({success:true, data: user});
  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email et mot de passe requis" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Identifiants invalides" });

    const isMatch = compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Identifiants invalides" });

    const token = create_Token(user.id);

    // Envoi en cookie HTTPOnly (plus sécurisé)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      data:{
       token, user
      }
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({sucess:true, data:{ message: "Déconnexion réussie" }});
};




// Refresh
// exports.refresh = (req, res) => {
//   try {
//     const refreshToken = req.cookies.token;
//     if (!refreshToken)
//       return res.status(401).json({ error: "Token de rafraîchissement manquant" });

//     jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
//       if (err) return res.status(403).json({ error: "Token de rafraîchissement invalide" });

//       const user = await prisma.user.findUnique({ where: { id: decoded._id } });
//       if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

//       const newToken = create_Token(user);
//       res.json({
//         success: true,
//         data:{ token: newToken }
//       })
//     });
//   } catch (error) {
//     console.error("Erreur refresh token:", error);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// };
