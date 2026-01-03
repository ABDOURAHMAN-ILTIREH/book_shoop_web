import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '../types';
import { UserService, LoginCredentials, UserCreateData,UserUpdateCurrentyUser } from '../services/userService';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  const getCurrentUser = async () => {
    try {
      const response = await UserService.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔐 Login (cookie set by backend)
   */
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const credentials: LoginCredentials = { email, password };

      const response = await UserService.login(credentials);

      // ❌ NO token storage
      // ✅ Cookie is already set by backend

      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📝 Register
   */
  const register = async (
    userData: Omit<User, 'id' | 'role'> & { password: string }
  ) => {
    setLoading(true);
    try {
      const registerData: UserCreateData = {
        ...userData,
        role: 'USER',
      };

      const response = await UserService.register(registerData);

      setUser(response.data.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🚪 Logout
   */
  const logout = async () => {
    try {
      await UserService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };
  
  /**
   * ✏️ Update profile
   */
  const updateProfile = async (
    name: string,
    phone: string,
    location: string

  ) => {

    const dataUpdateUser: UserUpdateCurrentyUser = {name,phone,location}

    setLoading(true);
    try {
      const response = await UserService.updateProfile(dataUpdateUser);
       setUser(prev => ({ ...prev, ...response.data }));
      console.log(response.data)
    } catch (error) {
      console.error('Profile update failed:', error);
      throw new Error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    getCurrentUser()
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
