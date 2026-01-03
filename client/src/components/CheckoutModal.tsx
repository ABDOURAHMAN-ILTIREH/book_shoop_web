import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../contexts/BooksContext';
import { useOrders } from '../contexts/OrdersContext';
import { useTranslation } from 'react-i18next';
import '../i18n';



interface CheckoutModalProps {
  onClose: () => void;
  cartItems: any[];
  total: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, cartItems, total }) => {
  const [step, setStep] = useState<'SHIPPING' | 'SUCCESS'>('SHIPPING');
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { updateMultipleBookStock } = useBooks(); // Ensure this function exists in BooksContextType or remove this line if unnecessary.
  const { createOrder,getMyOrders} = useOrders();
  const { t } = useTranslation();
   useEffect(() => {
    getMyOrders();
   }, []);


  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    address: user?.location || '',
    city: '',
    phone: user?.phone || '',
  });
 
 

  // Update shipping info when user data changes
  React.useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        address: user.location || prev.address,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsProcessing(true);
   
    // Préparer l’ordre
    const orderData = {
      items: cartItems.map(item => ({
        bookId: item.bookId,
        title: item.book.title,
        price: item.book.price,
        quantity: item.quantity,
      })),
      total,
      shippingAddress: {
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: 'Djibouti',
        zipCode: '00000',
        phone: shippingInfo.phone,
      },
      customerName: shippingInfo.fullName,
      status: 'PENDING',
      userId: user?.id || '',
    };

    try {
      // 1️⃣ Créer l’ordre via OrdersContext
      const newOrder = await createOrder(orderData);
      // setIsProcessing(false);
      
      // 2️⃣ Mettre à jour le stock des livres via BooksContext
      await updateMultipleBookStock(
        cartItems.map(item => ({ bookId: item.bookId, quantity: item.quantity }))
      );
     

  // Show processing animation then success
    setTimeout( () => {
      setIsProcessing(false);
      setStep('SUCCESS');
     
      // Show success notification
      const successEvent = new CustomEvent('orderSuccess', {
        detail: { 
          message: `Order #${newOrder?.id} has been successfully saved!`,
          orderId: newOrder?.id,
          total: total
        }
      });
      window.dispatchEvent(successEvent);
    }, 500);


    setTimeout(async () => {
       await clearCart(user?.id || '');
    }, 10000);


    } catch (error) {
      console.error('Failed to create order:', error);
      setIsProcessing(false);
      alert('There was an error processing your order. Please try again.');
      return;
    } 
  };

   
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        // onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-2 sm:mx-4
           p-6 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 scroll-smooth"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {step === 'SHIPPING' ? t('checkout.orderInformation') : t('checkout.orderConfirmed')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {step === 'SHIPPING' && (
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     {t('checkout.fullName')}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('checkout.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     {t('checkout.address')}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('checkout.city')}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('checkout.orderSummary')}</h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    {cartItems.map((item) => (
                     <React.Fragment key={item.bookId}>
                       <div className="flex justify-between items-start gap-2">
                         <span className="flex-1 truncate">{item.book.title} x {item.quantity}</span>
                         <span>{(item.book.price * item.quantity).toFixed(0)} Fdj</span>
                       </div>
                       <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 pl-2">
                         {t('book.stockAvaible')}: {item.book.stock - item.quantity}
                       </div>
                     </React.Fragment>
                    ))}
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>{total} Fdj</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                    isProcessing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{t('checkout.processingOrder')}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{t('checkout.saveOrder')}</span>
                    </>
                  )}
                </motion.button>
              </form>
            )}

            {step === 'SUCCESS' && (
              <div className="text-center py-6 sm:py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                   {t('checkout.orderSaved')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('checkout.orderPending')}
                </p>
                <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                         {t('checkout.orderTotal')}:{total.toFixed(0)} Fdj
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                         {t('checkout.thankYou')}
                      </p>
                    </div>
                  </div>
                </div>
                {/* <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  {t('checkout.continueShopping')}
                </motion.button> */}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutModal;