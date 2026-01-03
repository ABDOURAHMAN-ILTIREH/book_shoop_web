import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CartContextType, CartItem } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // 🔹 Load cart from backend
  const loadCart = async () => {
    try {
      setLoading(true);
      const cart = await cartService.getCart();
      setItems(cart);
    } catch (error) {
      console.error('Failed to load cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!user) return 
    loadCart();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
  
    loadCart();
  }, [user]);

  // 🔹 Add item
  const addToCart = async (
    userId: string,
    bookId: string,
    quantity = 1
  ) => {
    await cartService.addItem(userId,bookId, quantity);
    await loadCart();
  };

  // 🔹 Remove item
  const removeFromCart = async (cartItemId: string) => {
    await cartService.removeItem(cartItemId);
    await loadCart();
  };

  // 🔹 Update quantity
  const updateQuantity = async (
    cartItemId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }
    await cartService.updateQuantity(cartItemId, quantity);
    await loadCart();
  };

  // 🔹 Clear cart
  const clearCart = async (userId: string) => {
    await cartService.clearCart(userId);
    setItems([]);
  };

  // 🔹 Derived helpers (safe on client)
  const getCartTotal = () => {
    return items.reduce(
      (total, item) =>
        total +
        (item.book?.price ?? 0) * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return items.reduce(
      (count, item) => count + item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      'useCart must be used within a CartProvider'
    );
  }
  return context;
};
