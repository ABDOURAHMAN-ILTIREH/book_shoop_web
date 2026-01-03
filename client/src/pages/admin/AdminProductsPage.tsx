import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Edit, Trash2, Star } from 'lucide-react';

import { useBooks } from '../../contexts/BooksContext';
import { BookModal, DeleteModal } from '../../components/AdminModals';
import Pagination from '../../components/Pagination';
import { Book as BookType } from '../../types';
import '../../i18n'
import { useTranslation } from 'react-i18next';


const AdminProductsPage: React.FC = () => {
  const { t } = useTranslation();

  const { createBook,deleteBook,updateBook,books,getAllBooks} = useBooks();
  const [localBooks, setBooks] = useState(books|| []);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  useEffect( ()=>{
    getAllBooks();
  },[localBooks])

  // Modal states
  const [bookModal, setBookModal] = useState<{
    isOpen: boolean;
    book?: BookType;
    mode: 'add' | 'edit' | 'view';
  }>({ isOpen: false, mode: 'add' });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({ isOpen: false, id: '', title: '' });



  // Filter functions
  const getFilteredBooks = () => {
    const query = searchQuery.toLowerCase();
    if (!query) return localBooks;
    
    return localBooks.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.price.toString().includes(query)
    );
  };

  // Get paginated data
  const filteredBooks = getFilteredBooks();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // Handler functions
  const handleSaveBook = async (bookData: Partial<BookType>) => {
    if (bookModal.mode === 'add') {
      const newBook: BookType = {
        ...bookData,
        id: Date.now().toString(),
        rating: 0,
        totalRatings: 0,
        featured: bookData?.featured || false,
        isNew: bookData?.isNew || false,
      } as BookType;
      setBooks([...localBooks, newBook]);
      await createBook(newBook as BookType);
    } else if (bookModal?.mode === 'edit' && bookModal?.book) {
      await updateBook(bookModal.book.id, bookData as Partial<BookType>);
      setBooks(localBooks.map(book => 
        book.id === bookModal.book!.id ? { ...book, ...bookData } : book
      ));
    }
  };

  const handleDelete = async () => {
    setBooks(localBooks.filter(book => book.id !== deleteModal.id));
    setDeleteModal({ isOpen: false, id: '', title: '' });
    await deleteBook(deleteModal.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('adminProducts.title')}</h2>
        <button 
          onClick={() => setBookModal({ isOpen: true, mode: 'add' })}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>{t('adminProducts.addBook')}</span>
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={t('adminProducts.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('adminProducts.showing', {
              from: startIndex + 1,
              to: Math.min(endIndex, filteredBooks.length),
              total: filteredBooks.length
            })}
            {searchQuery && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                {t('adminProducts.filteredFrom', { total: localBooks?.length })}
              </span>
            )}
          </p>
        </div>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminProducts.table.book')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminProducts.table.author')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminProducts.table.price')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminProducts.table.stock')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminProducts.table.rating')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminProducts.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedBooks.map((book) => (
                <tr key={book?.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={book?.image} alt={book?.title} className="h-12 w-10 object-cover rounded" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{book?.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                           {t(`categories.${book?.category}`)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{book?.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{book?.price} Fdj</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{book?.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-900 dark:text-white">{book?.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setBookModal({ isOpen: true, book, mode: 'view' })}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setBookModal({ isOpen: true, book, mode: 'edit' })}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteModal({ 
                          isOpen: true, 
                          id: book.id, 
                          title: `Delete "${book?.title}"?` 
                        })}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredBooks.length}
          />
        )}
      </div>

      {/* No Results Message */}
      {filteredBooks.length === 0 && searchQuery && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('adminProducts.noResults')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
           {t('adminProducts.noResultsDesc', { query: searchQuery })}

          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('adminProducts.clearSearch')}

          </button>
        </div>
      )}

      {/* Modals */}
      <BookModal
        book={bookModal.book}
        isOpen={bookModal.isOpen}
        onClose={() => setBookModal({ isOpen: false, mode: 'add' })}
        onSave={handleSaveBook}
        mode={bookModal.mode}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
        onConfirm={handleDelete}
        title={deleteModal.title}
        message={t('adminProducts.deleteWarning')}
      />
    </motion.div>
  );
};

export default AdminProductsPage;