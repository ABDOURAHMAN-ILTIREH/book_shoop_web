import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types';
import { BookService, BookFilters, BookCreateData, BookUpdateData } from '../services/bookService';

interface BooksContextType {
  books: Book[];
  loading: boolean;
  error: string | null;
  getAllBooks: (page?: number, limit?: number, filters?: BookFilters) => Promise<Book[]>;
  getBookById: (id: string) => Promise<Book | null>;
  createBook: (book: BookCreateData) => Promise<Book>;
  updateBook: (id: string, book: BookUpdateData) => Promise<Book>;
  deleteBook: (id: string) => Promise<boolean>;
  searchBooks: (query: string) => Promise<Book[]>;
  getBooksByCategory: (category: string) => Promise<Book[]>;
  getFeaturedBooks: () => Promise<Book[]>;
  getNewBooks: () => Promise<Book[]>;
  refreshBooks: () => Promise<void>;
  updateMultipleBookStock: (updates: { bookId: string; quantity: number }[]) => Promise<void>;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recharge tous les livres depuis l'API
  const refreshBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookService.getBooks();
      setBooks(response.data);
      console.log('Books refreshed',response.data);
    } catch (err) {
      console.error('Error loading books:', err);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBooks();
  }, []);

  // CRUD Operations
  const getAllBooks = async (page: number = 1, limit: number = 20, filters?: BookFilters): Promise<Book[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookService.getBooks(page, limit, filters);
      setBooks(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBookById = async (id: string): Promise<Book | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookService.getBookById(id);
      return response.data;
    } catch (err) {
      console.error('Error fetching book:', err);
      setError('Failed to fetch book');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (bookData: BookCreateData): Promise<Book> => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookService.createBook(bookData);
      setBooks(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating book:', err);
      setError('Failed to create book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: string, bookData: BookUpdateData): Promise<Book> => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookService.updateBook(id, bookData);
      setBooks(prev => prev.map(book => book.id === id ? response.data : book));
      return response.data;
    } catch (err) {
      console.error('Error updating book:', err);
      setError('Failed to update book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await BookService.deleteBook(id);
      setBooks(prev => prev.filter(book => book.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search and Filter
  const searchBooks = async (query: string): Promise<Book[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookService.searchBooks(query);
      setBooks(response.data);
      return response.data;
    } catch (err) {
      console.error('Error searching books:', err);
      setError('Failed to search books');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBooksByCategory = async (category: string): Promise<Book[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookService.getBooksByCategory(category);
      setBooks(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching books by category:', err);
      setError('Failed to get books by category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedBooks = async (): Promise<Book[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookService.getFeaturedBooks();
      const featuredBoosk = response.data.books;
      setBooks(featuredBoosk);
      return featuredBoosk;
    } catch (err) {
      console.error('Error fetching featured books:', err);
      setError('Failed to get featured books');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getNewBooks = async (): Promise<Book[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookService.getNewBooks();
      const newBooks = response.data.books;
      setBooks(newBooks);
      return newBooks;
    } catch (err) {
      console.error('Error fetching new books:', err);
      setError('Failed to get new books');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMultipleBookStock = async (updates: { bookId: string; quantity: number }[]): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await BookService.updateMultipleBookStock(updates);
      setBooks(prev =>
        prev.map(book => {
          const update = updates.find(u => u.bookId === book.id);
          return update ? { ...book, stock: book.stock + update.quantity } : book;
        })
      );
    } catch (err) {
      console.error('Error updating multiple book stocks:', err);
      setError('Failed to update book stocks');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: BooksContextType = {
    books,
    loading,
    error,
    updateMultipleBookStock,
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    searchBooks,
    getBooksByCategory,
    getFeaturedBooks,
    getNewBooks,
    refreshBooks,
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) throw new Error('useBooks must be used within a BooksProvider');
  return context;
};
