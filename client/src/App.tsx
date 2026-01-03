import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BooksProvider } from './contexts/BooksContext';
import { UsersProvider } from './contexts/UsersContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { CommentsProvider } from './contexts/CommentsContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksPage from './pages/BooksPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './contexts/AuthContext';



const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/books" replace/>;
  }
  
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/login"  replace/>;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen transition-colors duration-300">
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HomePage />
              </motion.div>
            } />
            <Route path="/login" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LoginPage />
              </motion.div>
            } />
            <Route path="/register" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RegisterPage />
              </motion.div>
            } />
            <Route path="/books" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BooksPage />
              </motion.div>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CartPage />
                </motion.div>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfilePage />
                </motion.div>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <OrdersPage />
                </motion.div>
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute adminOnly>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminDashboard />
                </motion.div>
              </ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
     <AuthProvider>
      <BooksProvider>
        <UsersProvider>
          <OrdersProvider>
            <CommentsProvider>
                <CartProvider>
                  <AppContent />
                </CartProvider>
            </CommentsProvider>
          </OrdersProvider>
        </UsersProvider>
      </BooksProvider>
     </AuthProvider>
    </ThemeProvider>
  );
};

export default App;