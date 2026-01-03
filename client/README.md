# BookStore Application

A modern, full-featured bookstore application built with React, TypeScript, and Tailwind CSS.

## Features

- 📚 Book catalog with search and filtering
- 🛒 Shopping cart functionality
- 👤 User authentication and profiles
- 📦 Order management
- 💬 Book reviews and ratings
- 🎨 Dark/Light theme support
- 📱 Responsive design
- 🔧 Admin dashboard

## API Integration

This application is ready for API integration. All fake data has been removed and replaced with proper service layers.

### API Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the API base URL in `.env`:
   ```
   VITE_REACT_APP_API_BASE_URL=http://your-api-server.com/api
   ```

### API Endpoints Expected

The application expects the following API endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

#### Books
- `GET /books` - Get all books (with pagination and filters)
- `GET /books/:id` - Get single book
- `POST /books` - Create book (Admin)
- `PUT /books/:id` - Update book (Admin)
- `DELETE /books/:id` - Delete book (Admin)
- `GET /books/featured` - Get featured books
- `GET /books/new` - Get new arrivals
- `GET /books/search?q=query` - Search books
- `GET /books/category/:category` - Get books by category

#### Orders
- `GET /orders` - Get all orders (Admin)
- `GET /orders/my` - Get current user's orders
- `GET /orders/:id` - Get single order
- `POST /orders` - Create new order
- `PUT /orders/:id/status` - Update order status (Admin)

#### Comments
- `GET /comments` - Get all comments (Admin)
- `GET /books/:id/comments` - Get comments for a book
- `POST /comments` - Create new comment
- `DELETE /comments/:id` - Delete comment (Admin)

#### Users (Admin)
- `GET /users` - Get all users
- `GET /users/:id` - Get single user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### API Response Format

The application expects responses in this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

For paginated responses:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Authentication

The application uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Tokens are sent in the `Authorization` header as `Bearer <token>`
- The API should return user data and token on login/register

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service layers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── config/             # Configuration files
```

## Service Layer

The application uses a service layer pattern for API communication:

- `BookService` - Book-related API calls
- `UserService` - User and authentication API calls
- `OrderService` - Order management API calls
- `CommentService` - Comment and review API calls

Each service handles:
- API endpoint calls
- Error handling
- Data transformation
- Type safety

## Error Handling

The application includes comprehensive error handling:
- Network errors
- Authentication errors
- Validation errors
- Server errors
- User-friendly error messages

## Ready for Production

This application is production-ready with:
- ✅ Clean architecture
- ✅ Type safety with TypeScript
- ✅ Proper error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Dark/Light theme
- ✅ API service layer
- ✅ Authentication flow
- ✅ Admin functionality

Simply connect your API endpoints and the application will work seamlessly!