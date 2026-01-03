import { UserCreateData, UserUpdateData } from "../services/userService";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  location: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  category: string;
  language: string;
  stock: number;
  rating: number;
  totalRatings: number;
  description: string;
  image: string;
  featured: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  book?: Book;
  userId: string;
  bookId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    bookId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  customerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading?: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'role'> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name:string,phone:string,location:string) => Promise<void>;
  getCurrentUser: () => Promise<void>;
}
export interface CommentsContextType {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  // Comment operations
  getComments: (bookId: string) => Promise<Comment[]>;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  // Utility
  refreshcomments: () => Promise<void>;
}
export interface UsersContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  // Admin operations
  fetchUsers: () => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  createUser: (data: UserCreateData) => Promise<User>;
  updateUser: (id: string, data: UserUpdateData) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  // Utilities
  searchUsers: (query: string) => Promise<User[]>;
  getUsersByRole: (role: 'USER' | 'ADMIN') => Promise<User[]>;
} 

export interface CartContextType {
  items: CartItem[];
  addToCart: (userId: string, bookId: string, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: (userId: string) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface BookContextType {
  books: Book[];
  loading: boolean;
  error: string | null;
  // Book operations
  getBooks: () => Promise<Book[]>;
  getBookById: (id: string) => Promise<Book | null>;
  searchBooks: (query: string) => Promise<Book[]>;
  getBooksByCategory: (category: string) => Promise<Book[]>;
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  // Comments
  getComments: (bookId: string) => Promise<Comment[]>;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  // Special queries
  getFeaturedBooks: () => Promise<Book[]>;
  getNewBooks: () => Promise<Book[]>;
  // Utility
  refreshBooks: () => Promise<void>;
  updateBookStock: (bookId: string, quantityToDecrease: number) => Promise<void>;
  updateMultipleBookStock: (items: Array<{ bookId: string; quantity: number }>) => Promise<void>;
}
export interface OrderContextType {
  orders: Order[];
  loading: boolean;
  createOrder: (shippingAddressId: string) => Promise<void>;
  getMyOrders: () => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  getAllOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
}

export interface formatDateWithDay {
  (date: string): string;
}