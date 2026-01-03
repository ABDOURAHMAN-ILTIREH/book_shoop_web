import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Book } from '../types';
import BookCard from './BookCard';
import '../i18n'
import {useTranslation } from 'react-i18next';

interface FeaturedSliderProps {
  books: Book[];
  onViewBook?: (book: Book) => void;
}

const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ books, onViewBook }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t} = useTranslation();

  // Reset to first slide when books change
  useEffect(() => {
    setCurrentIndex(0);
  }, [books]);

  useEffect(() => {
    if (books?.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % books?.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [books.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + books?.length) % books?.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % books.length);
  };

  if (books.length === 0) return null;

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        {t('nav.features')}
      </h2>
      
      <div className="relative overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md">
              <BookCard book={books[currentIndex]} onViewDetails={onViewBook} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {books?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-blue-600 dark:bg-blue-400 w-8'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSlider;