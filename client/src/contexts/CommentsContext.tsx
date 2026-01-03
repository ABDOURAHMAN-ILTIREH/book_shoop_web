import React, { createContext, useContext, useEffect, useState} from 'react';
import { Comment } from '../types';
import { CommentService, CommentCreateData, CommentUpdateData } from '../services/commentService';


interface CommentsContextType {
  comments: Comment[];
  loading: boolean;
  error: string | null;

  getComments: () => Promise<Comment[]>;
  getCommentsByBook: (bookId: string) => Promise<Comment[]>;
  getMyComments: () => Promise<void>;
  getCommentById: (id: string) => Promise<Comment>;

  createComment: (data: CommentCreateData) => Promise<Comment>;
  updateComment: (id: string, data: CommentUpdateData) => Promise<Comment>;
  deleteComment: (id: string) => Promise<void>;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export const CommentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  // 🔹 Fetch all comments (Admin)
  const getComments = async (): Promise<Comment[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await CommentService.getComments();
      setComments(res.data.comments);
      return res.data.comments;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comments');
      return [];
    } finally {
      setLoading(false);
    }
  };
   useEffect(() => {
      getComments();
    }, []);

  // 🔹 Fetch comments for one book
 // Fetch comments for one book
const getCommentsByBook = async (bookId: string): Promise<Comment[]> => {
  setLoading(true);
  setError(null);

  try {
    const res = await CommentService.getBookComments(bookId);
    setComments(res.data.comments);    // state global
    return res.data.comments;            // ✅ retour pour le composant
  } catch (err: any) {
    setError(err.message || 'Failed to fetch book comments');
    return [];                  // ✅ toujours retourner un tableau
  } finally {
    setLoading(false);
  }
};

 // 🔹 Get single comment by ID
const getCommentById = async (id: string): Promise<Comment> => {
  setLoading(true);
  setError(null);
  try {
    const res = await CommentService.getCommentById(id);
    return res.data;
  } catch (err: any) {
    setError(err.message || 'Failed to fetch comment');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // 🔹 Fetch current user's comments
  const getMyComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await CommentService.getMyComments();
      setComments(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch my comments');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create comment
  const createComment = async (data: CommentCreateData): Promise<Comment> => {
    setLoading(true);
    setError(null);
    try {
      const res = await CommentService.createComment(data);
      setComments(prev => [res.data, ...prev]);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create comment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update comment
  const updateComment = async (id: string, data: CommentUpdateData): Promise<Comment> => {
    setLoading(true);
    setError(null);
    try {
      const res = await CommentService.updateComment(id, data);
      setComments(prev =>
        prev.map(c => (c.id === id ? res.data : c))
      );
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update comment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete comment
  const deleteComment = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await CommentService.deleteComment(id);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommentsContext.Provider
      value={{
        comments,
        loading,
        error,
        getComments,
        getCommentById,
        getCommentsByBook,
        getMyComments,
        createComment,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
};
