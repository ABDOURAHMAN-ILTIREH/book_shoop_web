import { apiClient, ApiResponse, PaginatedResponse } from './api';
import { Comment } from '../types';

export interface CommentCreateData {
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
}

export interface CommentUpdateData {
  rating?: number;
  text?: string;
}

export interface CommentFilters {
  bookId?: string;
  userId?: string;
  rating?: number;
  dateFrom?: string;
  dateTo?: string;
}
export interface CommentsResponse {
  comments: Comment[];
}

export class CommentService {
  // Create new comment
  static async createComment(commentData: CommentCreateData): Promise<ApiResponse<Comment>> {
    return apiClient.post<ApiResponse<Comment>>('/comments', commentData);
  }

  // Get all comments (Admin)
  static async getComments(): Promise<ApiResponse<CommentsResponse>> {
      return apiClient.get<ApiResponse<CommentsResponse>>('/comments');
}
  

  // Get single comment by ID
  static async getCommentById(id: string): Promise<ApiResponse<Comment>> {
    return apiClient.get<ApiResponse<Comment>>(`/comments/${id}`);
  }

  // Update comment
  static async updateComment(id: string, commentData: CommentUpdateData): Promise<ApiResponse<Comment>> {
    return apiClient.put<ApiResponse<Comment>>(`/comments/${id}`, commentData);
  }

  // Delete comment
  static async deleteComment(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/comments/${id}`);
  }

  // Get comments for a specific book
  static async getBookComments(bookId: string): Promise<ApiResponse<CommentsResponse>> {
    return apiClient.get<ApiResponse<CommentsResponse>>(`/books/${bookId}/comments`);
  }

  // Get user's comments
  static async getUserComments(userId: string): Promise<ApiResponse<Comment[]>> {
    return apiClient.get<ApiResponse<Comment[]>>(`/users/${userId}/comments`);
  }

  // Get current user's comments
  static async getMyComments(): Promise<ApiResponse<Comment[]>> {
    return apiClient.get<ApiResponse<Comment[]>>('/comments/my');
  }

  // Get comments by rating
  static async getCommentsByRating(rating: number): Promise<ApiResponse<Comment[]>> {
    return apiClient.get<ApiResponse<Comment[]>>(`/comments/rating/${rating}`);
  }

  // Search comments
  static async searchComments(query: string): Promise<ApiResponse<Comment[]>> {
    return apiClient.get<ApiResponse<Comment[]>>(`/comments/search?q=${encodeURIComponent(query)}`);
  }

  // Get comment statistics (Admin)
  static async getCommentStats(): Promise<ApiResponse<{
    total: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }>> {
    return apiClient.get<ApiResponse<any>>('/comments/stats');
  }
}