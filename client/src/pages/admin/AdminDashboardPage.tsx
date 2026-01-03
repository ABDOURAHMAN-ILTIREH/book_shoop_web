import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Book,
  Users,
  ShoppingCart,
  MessageCircle,
} from 'lucide-react';

import { useComments } from '../../contexts/CommentsContext';
import { useBooks } from '../../contexts/BooksContext';
import {useUsers} from '../../contexts/UsersContext'
import {useOrders} from '../../contexts/OrdersContext'
import "../../i18n"
import { useTranslation } from 'react-i18next';

const AdminDashboardPage: React.FC = () => {
  const {t} = useTranslation();
  const { getAllBooks,books:fetchedBooks } = useBooks();
  const { users: mockUsers,fetchUsers } = useUsers();
  const { orders: mockOrders,getAllOrders } = useOrders();
  const { comments: mockComments,getComments} = useComments();

  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

 
  // Load featured books on component mount
  useEffect(() => {
    getAllBooks()
    fetchUsers();
    getAllOrders();
    getComments();
  }, []);
  
useEffect(() => {
  const featuredBooks = fetchedBooks.filter(book => book.featured).map(b => b.id);
  // Update state seulement si différent
  setSelectedBooks(prev =>
    JSON.stringify(prev) !== JSON.stringify(featuredBooks) ? featuredBooks : prev
  );
}, [fetchedBooks]);

  
  const books = fetchedBooks;
  const users = mockUsers;
  const orders = mockOrders;
  const mockCommentsData = mockComments;

  const handleUpdateFeaturedBooks = () => {
    if (selectedBooks.length === 0) {
      setSuccessMessage('Please select at least one book to feature.');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    // Update featured status in BooksContext
    books.forEach(book => {
      book.featured = selectedBooks.includes(book.id);
    });
    
    // Also trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('featuredBooksUpdated', {
      detail: { featuredBooks: selectedBooks }
    }));

    // Show success message
    setSuccessMessage(
      selectedBooks.length === 1
        ? t('adminDashboard.successUpdate', { count: 1 })
        : t('adminDashboard.successUpdatePlural', { count: selectedBooks.length })
    );
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleBookToggle = (bookId: string) => {
    if (selectedBooks.includes(bookId)) {
      // Remove book from selection
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    } else if (selectedBooks.length < 3) {
      // Add book to selection (max 3)
      setSelectedBooks([...selectedBooks, bookId]);
    } else {
      // Show message if trying to select more than 3
      setSuccessMessage(t('adminDashboard.maxLimit'));
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">{t('adminDashboard.totalBooks')}</p>
              <p className="text-2xl font-bold">{books?.length}</p>
            </div>
            <Book className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-green-500 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">{t('adminDashboard.totalUsers')}</p>
              <p className="text-2xl font-bold">{users?.length}</p>
            </div>
            <Users className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-purple-500 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">{t('adminDashboard.totalOrders')}</p>
              <p className="text-2xl font-bold">{orders?.length}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-orange-500 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">{t('adminDashboard.totalComments')}</p>
              <p className="text-2xl font-bold">{mockCommentsData?.length}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`px-4 py-3 rounded-lg mb-6 ${
            successMessage.includes('Successfully') 
              ? 'bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200'
              : 'bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-200'
          }`}
        >
          {successMessage}
        </motion.div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
         {t('adminDashboard.manageFeatured')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
           {t('adminDashboard.manageDescription')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {books.slice(0, 9).map((book) => (
            <div
              key={book?.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedBooks.includes(book?.id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              onClick={() => handleBookToggle(book?.id)}
            >
              <img src={book?.image} alt={book?.title} className="w-full h-32 object-cover rounded mb-2" />
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{book?.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{t('book.by')} {book?.author}</p>
              {selectedBooks.includes(book?.id) && (
                <div className="mt-2 flex items-center justify-center">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {t('adminDashboard.updateFeatured')} # {selectedBooks?.indexOf(book?.id) + 1}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedBooks.length === 0 && t('adminDashboard.noBooksSelected')}
            {selectedBooks.length === 1 && t('adminDashboard.oneBookSelected')}
            {selectedBooks.length > 1 &&
              t('adminDashboard.manyBooksSelected', { count: selectedBooks?.length })}
            {selectedBooks.length === 3 && ` ${t('adminDashboard.maxReached')}`}
          </div>
          
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpdateFeaturedBooks}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
           {t('adminDashboard.updateFeatured')}
        </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;