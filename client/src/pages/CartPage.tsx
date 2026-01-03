import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart, CreditCard, CheckCircle, X, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../contexts/BooksContext';
import CheckoutModal from '../components/CheckoutModal';
import "../i18n"
import { useTranslation } from 'react-i18next';


const CartPage: React.FC = () => {
  const { t} = useTranslation();
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { books } = useBooks();
  const [showCheckout, setShowCheckout] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{ orderId: string; total: number } | null>(null);

  const cartWithDetails = items.map(item => {
    const book = books.find(b => b.id === item.bookId);
    return { ...item, book };
  }).filter(item => item.book);

  const total = getCartTotal();

  // Listen for order success events
  React.useEffect(() => {
    const handleOrderSuccess = (event: CustomEvent) => {
      setSuccessMessage(event.detail.message);
      setShowCheckout(false);
      
      // Show popup success message
      setOrderDetails({
        orderId: event.detail.orderId,
        total: event.detail.total
      });
      setShowSuccessPopup(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      // Auto-hide popup after 8 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        setOrderDetails(null);
      }, 15000);
    };

    window.addEventListener('orderSuccess', handleOrderSuccess as EventListener);
    return () => {
      window.removeEventListener('orderSuccess', handleOrderSuccess as EventListener);
    };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t("cart.cartEmpty")}
          </h2>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('cart.cartEmpty')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('cart.cartEmptySubtitle')}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('cart.shoppingCart')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {items.length} {items.length > 1 ?  t('cart.itemsInCartPlural') : t('cart.itemsInCart')}
          </p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200">
                  {t('cart.orderSuccessful')}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {successMessage}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="space-y-4">
                {cartWithDetails.map((item, index) => (
                  <motion.div
                    key={item.bookId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <img
                      src={item.book!.image}
                      alt={item.book!.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.book!.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('cart.byAuthor')} {item.book!.author}
                      </p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {item.book!.price} Fdj
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.book!.stock}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {item.quantity >= item.book!.stock && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        {t('cart.maxStockReached')}
                      </p>
                    )}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('cart.orderSummary')}
              </h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('cart.subtotal')}:</span>
                  <span className="font-semibold">{total.toFixed(0)} Fdj</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('cart.shipping')}:</span>
                  <span className="font-semibold">{t('cart.free')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('cart.tax')}:</span>
                  <span className="font-semibold">{(total).toFixed(0)} Fdj</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{t('cart.total')}:</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {(total).toFixed(0)} Fdj
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCheckout(true)}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>{t('cart.proceedToCheckout')}</span>
                </motion.button>
                
                <button
                  onClick={() => clearCart(user.id)}
                  className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('cart.clearCart')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          cartItems={cartWithDetails}
          total={total}
        />
      )}

      {/* Success Popup Modal */}
      {showSuccessPopup && orderDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowSuccessPopup(false);
            setOrderDetails(null);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  setOrderDetails(null);
                }}
                className="absolute top-4 right-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Package className="h-8 w-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">{t('cart.orderSuccessful')}</h2>
                <p className="text-green-100">{t('cart.orderSaved')}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('cart.orderId')}:</span>
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      #{orderDetails.orderId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('cart.totalAmount')}:</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {orderDetails.total.toFixed(0)} Fdj
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 mb-3">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{t('cart.orderStatusPending')}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('cart.thankYouMessage')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowSuccessPopup(false);
                    setOrderDetails(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  {t('cart.continueShopping')}
                </motion.button>
                {/* <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowSuccessPopup(false);
                    setOrderDetails(null);
                    // Navigate to orders page (you can add navigation here)
                    window.location.href = '/orders';
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  {t('cart.viewOrders')}
                </motion.button> */}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CartPage;