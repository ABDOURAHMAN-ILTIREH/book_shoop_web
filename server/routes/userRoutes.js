const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require("../middleware/middleware");

router.use(authenticateToken);

router.get('/me', userController.me);
// Mettre à jour le profil
router.put('/me', userController.updateProfile);

// GET /users
router.get('/', userController.getAllUsers);

// GET /users/search?query=...
router.get('/search', userController.searchUsers);

// GET /users/role/:role
router.get('/role/:role', userController.getUsersByRole);

// GET /users/:id
router.get('/:id', userController.getUserById);

// GET /users/:id/orders
router.get('/:id/orders', userController.getUserOrders);

// GET /users/:id/comments
router.get('/:id/comments', userController.getUserComments);

//update /users/:id
router.put('/:id', userController.updateUser);

//delete Users/:id
router.delete('/:id',userController.deleteUser);

module.exports = router;
