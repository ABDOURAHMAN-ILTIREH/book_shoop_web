import { apiClient } from './api';
import { CartItem } from '../types';

class CartService {
  async getCart(): Promise<CartItem[]> {
    return apiClient.get<CartItem[]>('/cart/my');
  }

  async addItem(
    userId: string,
    bookId: string,
    quantity = 1
  ): Promise<CartItem> {
    return apiClient.post<CartItem>('/cart', {
      userId,
      bookId,
      quantity,
    });
  }

  async updateQuantity(
    cartItemId: string,
    quantity: number
  ): Promise<CartItem> {
    return apiClient.put<CartItem>(
      `/cart/${cartItemId}`,
      { quantity }
    );
  }

  async removeItem(cartItemId: string): Promise<void> {
    return apiClient.delete<void>(`/cart/${cartItemId}`);
  }

  async clearCart(userId: string): Promise<void> {
    return apiClient.delete<void>(`/cart/${userId}/clear`);
  }
}

export const cartService = new CartService();
