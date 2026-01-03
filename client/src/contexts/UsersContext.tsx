import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { UserService, UserCreateData, UserUpdateData } from '../services/userService';
import { useAuth } from './AuthContext';
interface UsersContextType {
  users: User[];
  loading: boolean;
  error: string | null;

  // Admin operations
  fetchUsers: () => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  createUser: (data: UserCreateData) => Promise<User>;
  updateUser: (id: string, data: UserUpdateData) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;

  // Utilities
  searchUsers: (query: string) => Promise<User[]>;
  getUsersByRole: (role: 'USER' | 'ADMIN') => Promise<User[]>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // =========================
  // FETCH ALL USERS (ADMIN)
  // =========================
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.getUsers();
      setUsers(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    if (!user) {
      setUsers([]);
      return;
    }
  
    fetchUsers();
  }, [user]);


  
  // =========================
  // GET USER BY ID
  // =========================
  const getUserById = async (id: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.getUserById(id);
      return res.data;
    } catch {
      setError('User not found');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE USER (ADMIN)
  // =========================
  const createUser = async (data: UserCreateData): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.register(data);
      setUsers(prev => [...prev, res.data.user]);
      return res.data.user;
    } catch (err: any) {
      setError(err?.message || 'User creation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE USER (ADMIN)
  // =========================
  const updateUser = async (id: string, data: UserUpdateData): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.updateUser(id, data);
      setUsers(prev =>
        prev.map(u => (u.id === id ? res.data : u))
      );
      return res.data;
    } catch (err: any) {
      setError(err?.message || 'User update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE USER (ADMIN)
  // =========================
  const deleteUser = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await UserService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      setError(err?.message || 'User deletion failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SEARCH USERS
  // =========================
  const searchUsers = async (query: string): Promise<User[]> => {
    const res = await UserService.searchUsers(query);
    return res.data;
  };

  // =========================
  // FILTER BY ROLE
  // =========================
  const getUsersByRole = async (role: 'USER' | 'ADMIN'): Promise<User[]> => {
    const res = await UserService.getUsersByRole(role);
    return res.data;
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        loading,
        error,
        fetchUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        searchUsers,
        getUsersByRole,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within UsersProvider');
  }
  return context;
};
