import React, {useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, Users, Truck } from 'lucide-react';
import { Phone, Mail, MapPin } from "lucide-react";

import { useBooks } from '../contexts/BooksContext';
import BookCard from '../components/BookCard';
import FeaturedSlider from '../components/FeaturedSlider';
import { useAuth } from '../contexts/AuthContext';
import { Book } from '../types';
import "../i18n"
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t} = useTranslation();
  const { user } = useAuth();
  const { books } = useBooks();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  
 
  

  const getFeaturedBooks = (books: Book[]) => {
    return books.filter(book => book.featured === true);
  };
  const getNewBooks = (books: Book[]) => {
    return books.filter(book => book.isNew === true);
  };

  // Load featured books and new arrivals
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [featured, newBooks] = await Promise.all([
          getFeaturedBooks(books),
          getNewBooks(books)
        ]);
        setFeaturedBooks(featured?.slice(0, 3));
        setNewArrivals(newBooks?.slice(0, 4));
        console.log('feature',featured);
      } catch (error) {
        console.error('Error loading books:', error);
        // Set empty arrays as fallback
        setFeaturedBooks([]);
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    
  }, [books]);


  const features = [
    {
      icon: BookOpen,
      title: t('hero.vastCollectionTitle'),
      description: t('hero.vastCollectionDesc'),
    },
    {
      icon: Star,
      title: t('hero.qualityGuaranteedTitle'),
      description:t('hero.qualityGuaranteedDesc'),
    },
    {
      icon: Users,
      title: t('hero.communityReviewsTitle'),
      description: t('hero.communityReviewsDesc'),
    },
    {
      icon: Truck,
      title: t('hero.fastDeliveryTitle'),
      description: t('hero.fastDeliveryDesc'),
    },
  ];

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Hero Section */}
         <motion.header
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-blue-700 text-white"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex min-h-[48px] flex-col items-center justify-center gap-2 text-sm
                        sm:flex-row sm:justify-between sm:gap-6">

          {/* Left: Contact Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">

            {/* Phone */}
            <a
              href="tel:+25377000000"
              className="flex items-center gap-2 hover:text-blue-200 transition"
            >
              <Phone size={18} />
              <span className='text-base'>+253 77 00 00 00</span>
            </a>

            {/* Email */}
            <a
              href="mailto:contact@site.com"
              className="flex items-center gap-2 hover:text-blue-200 transition"
            >
              <Mail size={18} />
              <span className='text-base'>contact@site.com</span>
            </a>

            {/* Location */}
            <div className="flex items-center gap-2 text-blue-100">
              <MapPin size={18} />
              <span className='text-base'>Djibouti</span>
            </div>
          </div>

          {/* Right: WhatsApp */}
          <a
            href="https://wa.me/25377000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-1.5
                       font-medium text-white hover:bg-green-600 transition"
          >
             WhatsApp
          </a>

        </div>
      </div>
    </motion.header>
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('hero.welcomeTitle')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {t('hero.welcomeSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                     {t('hero.getStarted')}
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                    >
                      {t('hero.signIn')}
                    </motion.button>
                  </Link>
                </>
              )}
              <Link to="/books">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {t('hero.browseBooks')}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('hero.whyChoose')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('hero.whyChooseSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features?.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature?.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature?.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks?.length > 0 ? (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <FeaturedSlider books={featuredBooks} />
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                {t('hero.featuredBooks')}
              </h2>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-12">
                <div className="text-gray-400 mb-4">
                  <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('hero.noFeaturedBooks')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                   {t('hero.noBooksYet')}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
             {t('hero.newArrivals')}
            </h2>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : newArrivals?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {newArrivals?.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.05 }}
                    className="h-full"
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('hero.noNewBooks')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                   {t('hero.viewAllBooks')}
                </p>
              </div>
            )}
            {newArrivals?.length > 0 && (
              <div className="text-center mt-8">
                <Link to="/books">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                   {t('hero.viewAllBooks')}
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              {t('hero.readyToRead')}
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              {t('hero.readySubtitle')}
            </p>
            {!user && (
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                    {t('hero.joinToday')}
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;