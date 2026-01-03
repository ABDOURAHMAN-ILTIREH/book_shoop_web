import React from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrdersContext';
import { useEffect } from 'react';
import {formatDateWithDay } from '../utils/data';
import "../i18n"
import { useTranslation } from 'react-i18next';
const OrdersPage: React.FC = () => {
    const {t} = useTranslation();
  const { user } = useAuth();
  const { orders , getMyOrders } = useOrders();


  useEffect(() => {
      getMyOrders();
  }, []);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('orders.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
          {t('orders.subtitle')}
          </p>
        </motion.div>

        {orders?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
             {t('orders.emptyTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
             {t('orders.emptySubtitle')}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders?.map((order, index) => (
              <motion.div
                key={order?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('orders.order')} #{order?.id}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateWithDay(order?.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {/* <DollarSign className="h-4 w-4" /> */}
                          <span>{order?.total.toFixed(0)} Fdj</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order?.status)}`}>
                    {/* {order?.status.charAt(0).toUpperCase() + order?.status.slice(1)} */}
                    {t(`orders.status.${order?.status}`)}
                  </span>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">{t('orders.itemsOrdered')}</h4>
                    <div className="space-y-2">
                      {order?.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {item?.title} x {item?.quantity}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {(item?.price * item?.quantity).toFixed(0)} Fdj
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {t('orders.shippingAddress')}
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium text-gray-900 dark:text-white mb-1">{(order as any)?.customerName || user?.name}</p>
                      {(order as any)?.customerEmail && (
                        <p className="mb-2">{(order as any)?.customerEmail}</p>
                      )}
                      <p>{order?.shippingAddress.street}</p>
                      <p>{order?.shippingAddress.city}, {order?.shippingAddress.state} {order?.shippingAddress.zipCode}</p>
                      <p>{order?.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">{t('orders.totalAmount')}:</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {order?.total.toFixed(0)} Fdj
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;