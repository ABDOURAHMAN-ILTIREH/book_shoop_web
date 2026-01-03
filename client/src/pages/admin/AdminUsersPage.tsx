import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2 } from 'lucide-react';

import { useUsers } from '../../contexts/UsersContext';
import { UserModal,DeleteModal } from '../../components/AdminModals';
import Pagination from '../../components/Pagination';
import { User } from '../../types';
import '../../i18n'
import { useTranslation } from 'react-i18next';

const AdminUsersPage: React.FC = () => {
 
  const { t} = useTranslation();
  const { users,updateUser,deleteUser,fetchUsers } = useUsers();
  const [user, setUsers] = useState(users || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredUsers = user.filter(u => {
  if (!searchTerm) return true;

  const term = searchTerm.toLowerCase();
  return (
    u.name?.toLowerCase().includes(term) ||
    u.phone?.toLowerCase().includes(term)
  );
});

  // Modal states
  const [userModal, setUserModal] = useState<{
    isOpen: boolean;
    user?: User;
    mode: 'edit' | 'view';
  }>({ isOpen: false, mode: 'view' });

  const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        id: string;
        title: string;
      }>({ isOpen: false, id: '', title: '' });

  
  // Get paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(user.length / itemsPerPage);

  useEffect( ()=>{
    fetchUsers();
  },[user]);
  

  // Handler functions
 const handleSaveUser = async (userData: Partial<User>) => {
  if (!userModal.user) return;

  try {
    // 1️⃣ Appel API pour mettre à jour l'utilisateur
    await updateUser(userModal.user.id, userData as any);

    // 2️⃣ Mise à jour du state local uniquement après succès
    setUsers(user.map(user =>
      user.id === userModal.user!.id
        ? { ...user, ...userData } // ou updatedUser si l'API retourne l'objet complet
        : user
    ));

    // 3️⃣ Fermer le modal
    setUserModal({ isOpen: false, mode: 'view' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’utilisateur:', error);
    // Tu peux afficher un toast ou message d'erreur
  }
};


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleDelete = async() => {
    setUsers(user.filter(order => order.id !== deleteModal.id));
    setDeleteModal({ isOpen: false, id: '', title: '' });
    deleteUser(deleteModal.id);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">  {t('users.title')}</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <input
          type="text"
          placeholder={t('users.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                    focus:ring-blue-500 focus:border-blue-500
                    dark:bg-gray-700 dark:text-white"
        />
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
             {t('users.showing', { start: startIndex + 1, end: Math.min(endIndex, user.length), total: user.length })}
          </p>
        </div>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('users.name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('users.email')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('users.phone')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('users.location')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('users.role')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('users.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedUsers.map((user) => (
                <tr key={user?.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user?.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user?.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user?.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user?.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {user?.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setUserModal({ isOpen: true, user, mode: 'view' })}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setUserModal({ isOpen: true, user, mode: 'edit' })}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                       <button
                            onClick={() => setDeleteModal({ 
                            isOpen: true, 
                            id: user?.id, 
                            title: t('users.delete', { id:user?.name })
                            })}
                           className="text-red-600 hover:text-red-900"
                          >
                         <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredUsers.length}
          />
        )}
      </div>

      {/* Modals */}
      <UserModal
        key={userModal.user?.id || 'new'}
        user={userModal.user}
        isOpen={userModal.isOpen}
        onClose={() => setUserModal({ isOpen: false, mode: 'view' })}
        onSave={handleSaveUser}
        mode={userModal.mode}
      />
      <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
            onConfirm={handleDelete}
            title={deleteModal.title}
            message={t('adminOrders.deleteWarning')}
       />
    </motion.div>
  );
};

export default AdminUsersPage;