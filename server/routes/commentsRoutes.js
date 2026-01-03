const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const {authenticateToken,authorizeAdmin} = require('../middleware/middleware');

// router.get('/comments', commentController.getComments);
router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);
router.get('/:bookId/stats', commentController.getCommentsByBook);

router.use(authenticateToken);
router.post('/', commentController.createComment);

router.use(authorizeAdmin);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
