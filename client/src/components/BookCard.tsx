import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { Book } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import '../i18n';


interface BookCardProps {
  book: Book;
  onViewDetails?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onViewDetails }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
 

  const { addToCart } = useCart();
  let quantity = 1;
  
    const [stock, setStock] = useState(book.stock);

    const handleAddToCart = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (user && stock > 0) {
        await addToCart(user.id, book.id, quantity);
        setStock(prev => prev - quantity); // decrease local stock
      }
    };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600"
      onClick={() => onViewDetails?.(book)}
    >
      <div className="relative">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {book?.isNew && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
            >
             <span>{t('book.new')}</span>
            </motion.span>
          )}
          {book?.featured && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
            >
             <span>{t('book.featured')}</span>
            </motion.span>
          )}
        </div>
        
        {/* Sale badge */}
        {book?.isNew && (
          <div className="absolute top-3 right-3">
            {book.originalPrice && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                  {t('book.sale')}
              </motion.span>
            )}
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Title and Author */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
            {book?.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
           {t('book.by')} {book.author}
          </p>
        </div>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {renderStars(book?.rating)}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {book.rating}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({book.totalRatings} {t('book.reviews')})
          </span>
        </div>

        {/* Category and Language Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
            {/* {book?.category} */}
             {t(`categories.${book?.category}`)}
          </span>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-full">
            {/* {book?.language} */}
             {t(`languages.${book?.language}`)}
          </span>
        </div>

        {/* Description Preview */}
        {book?.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {book?.description}
          </p>
        )}

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {book?.price} Fdj
            </span>
            {book.originalPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {book?.originalPrice} Fdj
              </span>
            )}
            {book?.originalPrice && (
              <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full font-medium">
                {Math.round(((book?.originalPrice - book?.price) / book?.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${book?.stock > 10 ? 'bg-green-500' : book?.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${
              book?.stock > 10 ? 'text-green-600 dark:text-green-400' : 
              book?.stock > 0 ? 'text-yellow-600 dark:text-yellow-400' : 
              'text-red-600 dark:text-red-400'
            }`}>
              {book?.stock > 10 ? t('book.inStock') : book?.stock > 0 ? t('book.onlyLeft', { count:stock }) : t('book.outOfStock')}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
             {t('book.available', { count: stock })}
          </span>
        </div>

        {/* Action Button */}
        {user && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
              stock === 0
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{book?.stock === 0 ? t('book.outOfStock') : t('book.addToCart')}</span>
          </motion.button>
        )}

        {/* View Details Link for Non-Users */}
        {!user && (
          <div className="text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
             {t('book.signInToPurchase')}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookCard;