// API Configuration
export const API_CONFIG = {
  BASE_URL: (import.meta as any).env.VITE_REACT_APP_API_BASE_URL,
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/users/me',
    REFRESH: '/auth/refresh',
  },
  
  // Books
  BOOKS: {
    BASE: '/books',
    FEATURED: '/books/featured',
    NEW: '/books/new',
    SEARCH: '/books/search',
    CATEGORY: '/books/category',
    BY_ID: (id: string) => `/books/${id}`,
    STOCK: (id: string) => `/books/${id}/stock`,
    COMMENTS: (id: string) => `/books/${id}/comments`,
  },
  
  // Users
  USERS: {
    BASE: '/users',
    SEARCH: '/users/search',
    ROLE: (role: string) => `/users/role/${role}`,
    BY_ID: (id: string) => `/users/${id}`,
    ORDERS: (id: string) => `/users/${id}/orders`,
    COMMENTS: (id: string) => `/users/${id}/comments`,
  },
  
  // Profile
  PROFILE: {
    BASE: '/users/me',
    PASSWORD: '/profile/password',
  },
  
  // Orders
  ORDERS: {
    BASE: '/orders',
    MY: '/orders/my',
    STATS: '/orders/stats',
    BY_ID: (id: string) => `/orders/${id}`,
    STATUS: (id: string) => `/orders/${id}/status`,
    BY_STATUS: (status: string) => `/orders/status/${status}`,
    DATE_RANGE: '/orders/date-range',
  },
  
  // Comments
  COMMENTS: {
    BASE: '/comments',
    MY: '/comments/my',
    STATS: '/comments/stats',
    SEARCH: '/comments/search',
    BY_ID: (id: string) => `/comments/${id}`,
    BY_RATING: (rating: number) => `/comments/rating/${rating}`,
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timeout. Please try again.',
};