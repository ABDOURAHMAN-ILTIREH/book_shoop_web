const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const upload = require('../middleware/upload'); // ton middleware multer
const {authenticateToken,authorizeAdmin} = require('../middleware/middleware');


// GET /books (all books)
router.get('/', bookController.getAllBooks);

//Get books with pagination
router.get('/books', bookController.getBooks);

// delete
router.delete('/:id', bookController.deleteBook);

// GET /books/featured
router.get('/featured', bookController.getFeaturedBooks);
// GET /books/isnew
router.get('/new', bookController.getNewBooks);

// GET /books/search?query=...
router.get('/search', bookController.searchBooks);

// GET /books/category/:category
router.get('/category/:category', bookController.getBooksByCategory);

// GET /books/:id
router.get('/:id', bookController.getBookById);

router.put('/:id/MultiStocks', bookController.updateMultipleBookStock);


// GET /books/:id/comments
router.get('/:id/comments', bookController.getBookComments);


// POST /books with multer upload (image)
router.post('/uploads', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    filename: req.file.filename,
    url: `http://localhost:5000/api/uploads/${req.file.filename}`,
  });
});
router.use(authenticateToken);
router.use(authorizeAdmin);

router.post('/', bookController.createBook);

router.put("/:id",bookController.updateBook);



module.exports = router;
