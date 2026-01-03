import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Calendar, Filter, Trash2 } from 'lucide-react';

import { DeleteModal, OrderModal } from '../../components/AdminModals';
import Pagination from '../../components/Pagination';
import { Order } from '../../types';
import { useOrders } from '../../contexts/OrdersContext';
import { useTranslation } from 'react-i18next';
import '../../i18n'

import {formatDateWithDay } from '../../utils/data';


const AdminOrdersPage: React.FC = () => {
  const { t } = useTranslation();

  const {
    orders: initialMockOrders,
    updateOrderStatus,
    deleteOrder,
    getAllOrders
  } = useOrders();

  // Removed unused variable 'initialMockOrders'

  const [orders, setOrders] = useState(initialMockOrders || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const itemsPerPage = 10;
  const [customDate,setCustomDate] = useState('');


  useEffect(() => {
  getAllOrders();
}, [orders]);



 
  // Modal states
  const [orderModal, setOrderModal] = useState<{
    isOpen: boolean;
    order?: Order;
    mode: 'view' | 'edit';
  }>({ isOpen: false, mode: 'view' });

   const [deleteModal, setDeleteModal] = useState<{
      isOpen: boolean;
      id: string;
      title: string;
    }>({ isOpen: false, id: '', title: '' });

 
    const filteredOrders = orders.filter(order => {

       // ✅ STATUS FILTER
    if (statusFilter && order.status !== statusFilter) {
      return false;
    }
    if (!dateFilter) return true;

    const orderDate = new Date(order?.createdAt);
    const now = new Date();

    switch (dateFilter) {
      case 'today':
        return orderDate.toDateString() === now.toDateString();

      case 'yesterday': {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        return orderDate.toDateString() === yesterday.toDateString();
      }

      case 'thisWeek': {
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return orderDate >= startOfWeek;
      }

      case 'thisMonth':
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );

      case 'custom':
        if (!customDate) return true;
        return (
          orderDate.toISOString().split('T')[0] === customDate
        );
      default:
        return true;
    }
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Handler functions
  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status } : order

    ));
    await updateOrderStatus(id, status);
  };
  const handleDelete = async() => {
    setOrders(orders.filter(order => order.id !== deleteModal.id));
    setDeleteModal({ isOpen: false, id: '', title: '' });
    deleteOrder(deleteModal.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get row background color based on status
  const getRowBackgroundColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400';
      case 'DELIVERED':
        return 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400';
      case 'PROCESSING':
        return 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400';
      case 'SHIPPED':
        return 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400';
      default:
        return 'bg-white dark:bg-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('adminOrders.title')}</h2>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('adminOrders.filters')}:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
             {t('adminOrders.filterStatus')}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{t('adminOrders.allStatuses')}</option>
              <option value="PENDING">{t('model.pending')}</option>
              <option value="PROCESSING">{t('model.processing')}</option>
              <option value="SHIPPED">{t('model.shipped')}</option>
              <option value="DELIVERED">{t('model.delivered')}</option>
            </select>
          </div>

          {/* Date Filter */}
          
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('adminOrders.filterDate')}
          </label>

          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                      focus:ring-blue-500 focus:border-blue-500
                      dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t('adminOrders.allDates')}</option>
            <option value="today">{t('adminOrders.today')}</option>
            <option value="yesterday">{t('adminOrders.yesterday')}</option>
            <option value="thisWeek">{t('adminOrders.thisWeek')}</option>
            <option value="thisMonth">{t('adminOrders.thisMonth')}</option>
            <option value="custom">{t('adminOrders.customDate')}</option>
          </select>
        </div>

        {/* Custom Date Picker */}
        {dateFilter === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('adminOrders.selectDate')}
            </label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                        dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter('');
                setDateFilter('');
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {t('adminOrders.clearFilters')}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('adminOrders.showing', {
              from: startIndex + 1,
              to: Math.min(endIndex, filteredOrders.length),
              total: filteredOrders.length
            })}
            {(statusFilter || dateFilter) && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
               {t('adminOrders.filteredFrom', { total: orders?.length })}
              </span>
            )}
          </p>
        </div>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminOrders.table.orderId')}</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminOrders.table.customer')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('profile.phone')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminOrders.table.orderDate')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminOrders.table.items')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminOrders.table.total')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminOrders.table.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('adminOrders.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedOrders.map((order) => {
                return (
                  <tr key={order?.id} className={getRowBackgroundColor(order?.status)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order?.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order?.shippingAddress.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDateWithDay(order?.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                     {t('adminOrders.itemsCount', { count: order?.items.length })}

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order?.total.toFixed(0)} Fdj
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order?.status === 'DELIVERED' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : order?.status === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {/* {order.status.charAt(0).toUpperCase() + order.status.slice(1)} */}
                        {t(`orders.status.${order?.status}`)}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDateTime(order.createdAt)}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setOrderModal({ isOpen: true, order, mode: 'view' })} 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setOrderModal({ isOpen: true, order, mode: 'edit' })}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                         onClick={() => setDeleteModal({ 
                           isOpen: true, 
                           id: order?.id, 
                           title: t('adminOrders.deleteConfirm', { id: order?.customerName})

                          })}
                            className="text-red-600 hover:text-red-900"
                           >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredOrders.length}
          />
        )}
      </div>

      {/* No Results Message */}
      {filteredOrders?.length === 0 && (statusFilter || dateFilter) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Filter className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('adminOrders.noResults')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('adminOrders.noResultsDesc')}
          </p>
          <button
            onClick={() => {
              setStatusFilter('');
              setDateFilter('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('adminOrders.clearFilters')}
          </button>
        </div>
      )}

      {/* Modals */}
      <OrderModal
        order={orderModal.order}
        isOpen={orderModal.isOpen}
        onClose={() => setOrderModal({ isOpen: false, mode: 'view' })}
        onUpdateStatus={handleUpdateOrderStatus}
        mode={orderModal.mode}
      />
      <DeleteModal
      isOpen={deleteModal?.isOpen}
      onClose={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
      onConfirm={handleDelete}
      title={deleteModal?.title}
     message={t('adminOrders.deleteWarning')}
     />
    </motion.div>
  );
};

export default AdminOrdersPage;