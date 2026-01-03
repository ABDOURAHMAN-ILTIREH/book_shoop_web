import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, MessageCircle, Send } from 'lucide-react';
import { Book, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useComments } from '../contexts/CommentsContext';
import { formatDateWithDay } from '../utils/data';
import { useTranslation } from 'react-i18next';
import '../i18n';
interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { getCommentsByBook, createComment,comments } = useComments();
  const [quantity, setQuantity] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const [bookComments, setBookComments] = useState<Comment[]>(comments);

 
  useEffect(() => {
    if(book.id===undefined) return;
    getCommentsByBook(book.id).then(comments => setBookComments(comments));
  }, [newComment,newRating]);

const handleAddToCart = () => {
  if (!user) return;

  try {
    // 1️⃣ Appel API pour ajouter au panier
    addToCart(user.id, book.id, quantity);
    // 3️⃣ Fermer le modal après succès
    onClose();
  } catch (error) {
    console.error('Erreur lors de l’ajout au panier :', error);
    // Optionnel : afficher un toast ou message d'erreur
  }
};


 const handleSubmitComment = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  try {
    // 1️⃣ Appel API pour créer le commentaire
    const newCommentData = await createComment({
      bookId: book.id,
      userId: user.id,
      userName: user.name,
      rating: newRating,
      text: newComment,
    });
    

    // 2️⃣ Ajouter le commentaire dans le state local pour l'afficher immédiatement
    setBookComments(prev => [newCommentData, ...prev]);

    // 3️⃣ Réinitialiser le formulaire
    setNewComment('');
    setNewRating(5);

     // 4️⃣ Optionnel : scroll vers le haut pour voir le nouveau commentaire
    const commentsContainer = document.getElementById('comments-list');
    if (commentsContainer) {
      commentsContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch (error) {
    console.error('Failed to create comment:', error);
    // Optionnel : afficher un message d'erreur à l'utilisateur
  }
};


  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
        onClick={interactive && onStarClick ? () => onStarClick(index + 1) : undefined}
      />
    ));
  };

  return (
    <AnimatePresence>
      <motion.div
        key={book.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        // onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
               {t('bookDetail.addToCart')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 min-h-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Book Info */}
                <div className="flex flex-col space-y-4">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full max-w-xs sm:max-w-sm mx-auto lg:mx-0 rounded-lg shadow-lg flex-shrink-0"
                  />
                  
                  <div className="text-center lg:text-left space-y-3">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {book.title}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                      {t('book.by')} {book.author}
                    </p>

                    <div className="flex items-center justify-center lg:justify-start">
                      <div className="flex items-center mr-4">
                        {renderStars(book.rating)}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {book.rating} ({book.totalRatings} {t('book.reviews')})
                      </span>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start space-x-4">
                      <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {book.price} Fdj
                      </span>
                      {book.originalPrice && (
                        <span className="text-base sm:text-lg text-gray-500 line-through">
                          {book.originalPrice} Fdj
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {/* {book.category} */}
                          {t(`categories.${book?.category}`)}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                        {/* {book.language} */}
                          {t(`languages.${book?.language}`)}
                      </span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                        {book.stock} {t('book.inStock')}
                      </span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-center lg:text-left text-sm sm:text-base leading-relaxed">
                      {book.description}
                    </p>

                    {user && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('model.quantity')}:
                          </label>
                          <select
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          >
                            {Array.from({ length: Math.min(book.stock, 10) }, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddToCart}
                          //className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          disabled={book.stock === 0}
                          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          book.stock === 0
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                        }`}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          <span>{book?.stock === 0 ? t('book.outOfStock') : t('book.addToCart')}</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments Section */}
                <div className="flex flex-col min-h-0 lg:min-h-[600px]">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                      {t('bookDetail.reviews')} ({bookComments?.length || 0})
                  </h3>

                  {user && (
                    <form onSubmit={handleSubmitComment} className="mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex-shrink-0">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                         {t('bookDetail.leaveReview')}
                      </h4>
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                         {t('bookDetail.rating')}:
                        </label>
                        <div className="flex items-center space-x-1">
                          {renderStars(newRating, true, setNewRating)}
                        </div>
                      </div>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts about this book..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none text-sm"
                        required
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="mt-2 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Send className="h-4 w-4" />
                         <span>{t('bookDetail.submitReview')}</span>
                      </motion.button>
                    </form>
                  )}

                  {/* Comments List */}
                  <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 scroll-smooth min-h-0 max-h-96">
                    {bookComments?.map((comment) => (
                      <div key={comment?.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {comment?.userName}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDateWithDay(comment?.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          {renderStars(comment?.rating)}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {comment?.text}
                        </p>
                      </div>
                    ))}
                    {bookComments?.length === 0 && (
                      <div className="flex items-center justify-center h-24">
                        <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                          {t('bookDetail.noReviews')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


export default BookDetailModal;