import { apiClient, ApiResponse, PaginatedResponse } from './api';
import { Order } from '../types';

export interface OrderCreateData {
  items: Array<{
    bookId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    state: string;
    phone: string;
    zipCode: string;
    city: string;
  };
  total: number;
}

export interface OrderUpdateData {
  status?: Order['status'];
  shippingAddress?: Partial<Order['shippingAddress']>;
}

export interface OrderFilters {
  status?: Order['status'];
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export class OrderService {
  // Create new order
  static async createOrder(orderData: OrderCreateData): Promise<ApiResponse<Order>> {
    return apiClient.post<ApiResponse<Order>>('/orders', orderData);
  }

  // Get all orders (Admin)
  static async getOrders(
    page: number = 1,
    limit: number = 20,
    filters?: OrderFilters
  ): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return apiClient.get<PaginatedResponse<Order>>(`/orders?${params}`);
  }
  

  // Get single order by ID
  static async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
  }

  // Update order
  static async updateOrder(id: string, orderData: OrderUpdateData): Promise<ApiResponse<Order>> {
    return apiClient.put<ApiResponse<Order>>(`/orders/${id}`, orderData);
  }

  // Update order status
  static async updateOrderStatus(id: string, status: Order['status']): Promise<ApiResponse<Order>> {
    return apiClient.put<ApiResponse<Order>>(`/orders/${id}/status`, { status });
  }

  // Delete order
  static async deleteOrder(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/orders/${id}`);
  }

  // Get user's orders
  static async getUserOrders(userId: string): Promise<ApiResponse<Order[]>> {
    return apiClient.get<ApiResponse<Order[]>>(`/users/${userId}/orders`);
  }

  // Get current user's orders
  static async getMyOrders(): Promise<ApiResponse<{ orders: Order[] }>> {
    return apiClient.get<ApiResponse<{ orders: Order[] }>>('/orders/my');
  }

  // Get orders by status
  static async getOrdersByStatus(status: Order['status']): Promise<ApiResponse<Order[]>> {
    return apiClient.get<ApiResponse<Order[]>>(`/orders/status/${status}`);
  }

  // Get orders by date range
  static async getOrdersByDateRange(dateFrom: string, dateTo: string): Promise<ApiResponse<Order[]>> {
    return apiClient.get<ApiResponse<Order[]>>(`/orders/date-range?from=${dateFrom}&to=${dateTo}`);
  }

  // Get order statistics (Admin)
  static async getOrderStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    totalRevenue: number;
  }>> {
    return apiClient.get<ApiResponse<any>>('/orders/stats');
  }
}