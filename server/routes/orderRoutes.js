const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {authenticateToken,authorizeAdmin} = require('../middleware/middleware');

// Appliquer le middleware d'authentification à toutes les routes
router.use(authenticateToken);
// Routes pour les orders
router.get('/my', orderController.getMyOrders);// Récupérer les commandes de l'utilisateur connecté
router.post('/', orderController.createOrder);// Créer une nouvelle orders


router.use(authorizeAdmin);
router.get('/', orderController.getAllOrders);// Récupérer toutes les commandes
router.get('/stats', orderController.getOrderStats);// Récupérer les statistiques des commandes
router.get('/:status/status', orderController.getOrdersByStatus);// Récupérer les commandes par statut
router.get('/date-range', orderController.getOrdersByDateRange);// Récupérer les commandes dans une plage de dates
router.get('/:id', orderController.getOrderById);// Récupérer une commande par son ID
router.put('/:id/status', orderController.updateOrderStatus);// Mettre à jour le statut d'une commande
// router.put('/:id', orderController.updateOrder);// Mettre à jour une commande
router.delete('/:id', orderController.deleteOrder);// Supprimer une commande


module.exports = router;
