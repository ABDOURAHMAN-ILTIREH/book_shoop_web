const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItemController.js');
const { authenticateToken } = require("../middleware/middleware");

router.use(authenticateToken);
router.post('/', cartItemController.createCartItem);
router.get('/', cartItemController.getAllCartItems);
router.get('/my', cartItemController.getMyCartItems);
router.put('/:id', cartItemController.updateCartItem);
router.delete('/:id', cartItemController.deleteCartItem);
// DELETE /api/cart/:userId/clear
router.delete('/:userId/clear', cartItemController.clearCart);


module.exports = router;
