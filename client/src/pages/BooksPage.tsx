import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useBooks } from '../contexts/BooksContext';
import BookCard from '../components/BookCard';
import BookDetailModal from '../components/BookDetailModal';
import { Book } from '../types';
import '../i18n';
import { useTranslation } from 'react-i18next';
const BooksPage: React.FC = () => {
  const { t } = useTranslation();
  const { books, loading, error } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'rating'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  // Extraire les catégories et langues uniques
  // const categories = useMemo(() => Array.from(new Set((books || []).map(book => book.category))), [books]);
  // const languages = useMemo(() => Array.from(new Set((books || []).map(book => book.language))), [books]);

  // Filtrer et trier
  const filteredAndSortedBooks = useMemo(() => {
    if (!books) return [];
    let filtered = books.filter(book => {
      const matchesSearch =
        (book.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.author || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || book.category === selectedCategory;
      const matchesLanguage = !selectedLanguage || book.language === selectedLanguage;
      return matchesSearch && matchesCategory && matchesLanguage;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [books, searchTerm, selectedCategory, selectedLanguage, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return <div className="text-center py-16">{t('bookPage.loadingBooks')}</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{t('bookPage.errorPrefix')} {error}</div>;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('bookPage.browseBooks')}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('bookPage.browseSubtitle')}
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('bookPage.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{t('bookPage.allCategories')}</option>
               {Object.keys(t('categories', { returnObjects: true })).map(cat => (
                  <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                ))}
            </select>

            {/* Language */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{t('bookPage.allLanguages')}</option>
               {Object.keys(t('languages', { returnObjects: true })).map(lang => (
                  <option key={lang} value={lang}>{t(`languages.${lang}`)}</option>
                ))}
              </select>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'title' | 'price' | 'rating')}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="title">{t('bookPage.sortTitle')}</option>
                <option value="price">{t('bookPage.sortPrice')}</option>
                <option value="rating">{t('bookPage.sortRating')}</option>
              </select>
              <button
                onClick={toggleSortOrder}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <SortDesc className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600 dark:text-gray-400">
            {t('bookPage.showing')} {filteredAndSortedBooks.length} {t('bookPage.of')} {(books || []).length} {t('bookPage.books')}
          </p>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 scroll-smooth"
        >
          {filteredAndSortedBooks.length > 0 ? (
            filteredAndSortedBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.05 }}
                className="h-full"
              >
                <BookCard book={book} onViewDetails={setSelectedBook} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="col-span-full text-center py-16"
            >
              <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                ({t('bookPage.noBooksFound')})
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('bookPage.adjustFilters')}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Book Detail Modal */}
        {selectedBook && (
          <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
        )}
      </div>
    </div>
  );
};

export default BooksPage;
