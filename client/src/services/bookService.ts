import { apiClient, ApiResponse, PaginatedResponse } from './api';
import { Book } from '../types';

export interface BookFilters {
  category?: string;
  language?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  search?: string;
}

export interface BookCreateData {
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  category: string;
  language: string;
  stock: number;
  description: string;
  image: string;
  featured?: boolean;
  isNew?: boolean;
  rating?: number;
  totalRatings?: number;
}

export interface BookUpdateData extends Partial<BookCreateData> {}

export class BookService {
  // Get all books with optional filters and pagination
  static async getBooks(
    page: number = 1,
    limit: number = 20,
    filters?: BookFilters
  ): Promise<PaginatedResponse<Book>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, String(value)])
      )),
    });

    return apiClient.get<PaginatedResponse<Book>>(`/books/books?${params}`);
  }

  // Get single book by ID
  static async getBookById(id: string): Promise<ApiResponse<Book>> {
    return apiClient.get<ApiResponse<Book>>(`/books/${id}`);
  }

  // Get all books
  static async getAllBooks(): Promise<ApiResponse<Book[]>> {
    return apiClient.get<ApiResponse<Book[]>>('/books');
  }

  static async updateMultipleBookStock (items: Array<{ bookId: string; quantity: number }>): Promise<void> {
    await apiClient.put<ApiResponse<Book>>(`/books/${items[0].bookId}/MultiStocks`, { quantity: items[0].quantity });
  }

  // Create new book
  static async createBook(bookData: BookCreateData): Promise<ApiResponse<Book>> {
    return apiClient.post<ApiResponse<Book>>('/books', bookData);
  }

  // Update existing book
  static async updateBook(id: string, bookData: BookUpdateData): Promise<ApiResponse<Book>> {
    return apiClient.put<ApiResponse<Book>>(`/books/${id}`, bookData);
  }

  // Delete book
  static async deleteBook(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/books/${id}`);
  }

  // Get featured books
  static async getFeaturedBooks(): Promise<ApiResponse<{books:Book[]}>> {
    return apiClient.get<ApiResponse<{books:Book[]}>>('/books/featured');
  }

  // Get new arrivals
  static async getNewBooks(): Promise<ApiResponse<{books:Book[]}>> {
    return apiClient.get<ApiResponse<{books:Book[]}>>('/books/new');
  }

  // Search books
  static async searchBooks(query: string): Promise<ApiResponse<Book[]>> {
    return apiClient.get<ApiResponse<Book[]>>(`/books/search?q=${encodeURIComponent(query)}`);
  }

  // Get books by category
  static async getBooksByCategory(category: string): Promise<ApiResponse<Book[]>> {
    return apiClient.get<ApiResponse<Book[]>>(`/books/category/${encodeURIComponent(category)}`);
  }

  // Update book stock
  static async updateStock(id: string, stock: number): Promise<ApiResponse<Book>> {
    return apiClient.put<ApiResponse<Book>>(`/books/${id}/stock`, { stock });
  }
}