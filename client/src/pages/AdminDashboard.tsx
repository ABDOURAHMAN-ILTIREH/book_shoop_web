import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from './admin/AdminLayout';
import AdminDashboardPage from './admin/AdminDashboardPage';
import AdminProductsPage from './admin/AdminProductsPage';
import AdminUsersPage from './admin/AdminUsersPage';
import AdminOrdersPage from './admin/AdminOrdersPage';
import AdminCommentsPage from './admin/AdminCommentsPage';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Routes>
          <Route path="/" element={<AdminDashboardPage />} />
          <Route path="/products" element={<AdminProductsPage />} />
          <Route path="/users" element={<AdminUsersPage />} />
          <Route path="/orders" element={<AdminOrdersPage />} />
          <Route path="/comments" element={<AdminCommentsPage />} />
        </Routes>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;