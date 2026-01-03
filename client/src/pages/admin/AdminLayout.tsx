import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Book,
  Users,
  ShoppingCart,
  MessageCircle,
} from 'lucide-react';
import '../../i18n'
import { useTranslation } from 'react-i18next'; 

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t} = useTranslation();
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/products', label: 'Products', icon: Book },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/comments', label: 'Comments', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('nav.admin')}</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;