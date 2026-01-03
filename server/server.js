const express = require("express");
require("dotenv").config();
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');



// Middleware
const app = express();
app.use(express.json());
app.use(cookieParser());


// CORS (must come before other middleware)
app.use(cors({
  origin:  process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With','Cache-Control' ],
  maxAge: 86400
}));

// Import des routes
const authRoutes = require('./routes/authUserRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
// const profileRoutes = require('./routes/profileRoutes');
const orderRoutes = require('./routes/orderRoutes');
const commentRoutes = require('./routes/commentsRoutes');
const cartsRoutes = require('./routes/cartItemRoutes');

// Montage des routes avec préfixe /api (correspond à BASE_URL)
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/profile', profileRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/cart', cartsRoutes);
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));


// In your Express server (for production)
// if (process.env.NODE_ENV === 'production') {
//   // Serve static files from React build
//   app.use(express.static(path.join(__dirname, '../client/dist')));

//   // Handle React routing (FIXED)
//   app.get(/.*/, (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//   });
// }



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
