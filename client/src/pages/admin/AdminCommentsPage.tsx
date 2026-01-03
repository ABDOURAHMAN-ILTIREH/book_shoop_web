import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Trash2, Star, X } from 'lucide-react';

// Removed unused import for 'useBooks'
import { useComments } from '../../contexts/CommentsContext';
import { useBooks } from '../../contexts/BooksContext';
import { DeleteModal } from '../../components/AdminModals';
import Pagination from '../../components/Pagination';
import { Comment } from '../../types';
import { formatDateWithDay } from '../../utils/data';
import '../../i18n'
import { useTranslation } from 'react-i18next';

const AdminCommentsPage: React.FC = () => {
  const { t } = useTranslation();
  const { comments: initialComments,getComments ,deleteComment} = useComments();


  const { books } = useBooks();
  const [comments, setComments] = useState(initialComments);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  useEffect(() => {
  getComments();
}, []); 

    useEffect(() => {
  setComments(initialComments || []);
}, [initialComments]);

  // Modal states
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({ isOpen: false, id: '', title: '' });

  // Get paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedComments = comments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(comments.length / itemsPerPage);

  const handleDelete = async () => {
  if (!deleteModal.id) return;

  try {
    // 1️⃣ Appel API pour supprimer le commentaire
    await deleteComment(deleteModal.id);

    // 2️⃣ Mise à jour du state local uniquement après succès
    setComments(comments.filter(comment => comment.id !== deleteModal.id));

    // 3️⃣ Fermer le modal
    setDeleteModal({ isOpen: false, id: '', title: '' });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    // Optionnel : afficher un toast ou message d'erreur
  }
};


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white"> {t('comments.title')}</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
  {t('comments.showing', { start: startIndex + 1, end: Math.min(endIndex, comments.length), total: comments.length })}
          </p>
        </div>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('comments.book')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('comments.user')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('comments.rating')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('comments.comment')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('comments.date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('comments.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedComments.map((comment) => {
                const book = books?.find(b => b.id === comment.bookId);
                return ( 
                  <tr key={comment?.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {book?.title || 'Unknown Book'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {comment?.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {Array.from({ length: comment?.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {comment?.text}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDateWithDay(comment.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedComment(comment);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteModal({ 
                            isOpen: true, 
                            id: comment.id, 
                            title: `Delete comment by ${comment?.userName}?` 
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
            totalItems={comments.length}
          />
        )}
      </div>

      {/* Comment Detail Card */}
      {selectedComment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedComment(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden
            p-6 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 scroll-smooth"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Comment Details
              </h2>
              <button
                onClick={() => setSelectedComment(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Book Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Book Information
                  </h3>
                  {(() => {
                    const book = books?.find(b => b.id === selectedComment.bookId);
                    return (
                      <div className="flex items-center space-x-4">
                        {book && (
                          <>
                            <img
                              src={book?.image}
                              alt={book?.title}
                              className="w-16 h-20 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {book?.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                by {book?.author}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Category: {book?.category}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* User Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      User Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Name
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedComment?.userName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Comment Date
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {formatDateWithDay(selectedComment?.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Rating
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${
                              i < selectedComment.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedComment.rating}/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment Text */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Comment
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-900 dark:text-white leading-relaxed">
                      {selectedComment.text}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSelectedComment(null)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setDeleteModal({ 
                        isOpen: true, 
                        id: selectedComment.id, 
                        title: `Delete comment by ${selectedComment.userName}?` 
                      });
                      setSelectedComment(null);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Comment</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modals */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
        onConfirm={handleDelete}
        title={deleteModal.title}
        message={t('comments.deleteConfirm')}
      />
    </motion.div>
  );
};

export default AdminCommentsPage;