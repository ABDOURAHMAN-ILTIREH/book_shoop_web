import { apiClient, ApiResponse, PaginatedResponse } from './api';
import { User } from '../types';

export interface UserCreateData {
  name: string;
  email: string;
  phone: string;
  location: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  role?: 'USER' | 'ADMIN';
}
export interface UserUpdateCurrentyUser {
  name?: string;
  phone?: string;
  location?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: { user: any; token: any; };
  user: User;
  token: string;
}

export class UserService {
  // Authentication
  static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
  }

  static async register(userData: UserCreateData): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);
  }

  static async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>('/auth/logout', {});
  }

 static async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
  return apiClient.get<ApiResponse<{ user: User }>>('/users/me');
}

  // User Management (Admin)
  static async getUsers(page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return apiClient.get<PaginatedResponse<User>>(`/users?${params}`);
  }

  static async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>(`/users/${id}`);
  }

  static async updateUser(id: string, userData: UserUpdateData): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>(`/users/${id}`, userData);
  }


  static async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/users/${id}`);
  }

  // Profile Management
 
  static async updateProfile(data: UserUpdateCurrentyUser): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>('/users/me', data);
  }

  static async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.put<ApiResponse<void>>('/profile/password', {
      oldPassword,
      newPassword,
    });
  }

  // Search users
  static async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    return apiClient.get<ApiResponse<User[]>>(`/users/search?q=${encodeURIComponent(query)}`);
  }

  // Get users by role
  static async getUsersByRole(role: 'USER' | 'ADMIN'): Promise<ApiResponse<User[]>> {
    return apiClient.get<ApiResponse<User[]>>(`/users/role/${role}`);
  }
}

export { apiClient };
