import React, { createContext, useContext, useState,useEffect } from 'react';
import { Order } from '../types';
import { OrderService, OrderCreateData } from '../services/orderService';
import { useAuth } from './AuthContext';

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  getAllOrders: () => Promise<Order[]>;
  getMyOrders: () => Promise<Order[]>;
  getOrderById: (id: string) => Promise<Order | null>;
  createOrder: (data: OrderCreateData) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<Order>;
  deleteOrder: (id: string) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const getAllOrders = async (): Promise<Order[]> => {
  setLoading(true);
  setError(null);

  try {
    const res = await OrderService.getOrders();
    const ordersData= res.data
    setOrders(ordersData);
    return ordersData;

  } catch (err: any) {
    setError(err?.message || 'Failed to load orders');
    setOrders([]); // 🔒 sécurité
    return [];
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  getAllOrders();
}, []);



  // =========================
  // GET MY ORDERS
  // =========================
  const getMyOrders = async (): Promise<Order[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await OrderService.getMyOrders();
      const ordersData = res.data.orders;
      setOrders(ordersData);
      return ordersData;
    } catch (err: any) {
      setError(err?.message || 'Failed to load orders');
      throw err;
      return [];
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET ORDER BY ID
  // =========================
  const getOrderById = async (id: string): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await OrderService.getOrderById(id);
      return res.data;
    } catch (err: any) {
      setError(err?.message || 'Order not found');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE ORDER (WITH SHIPPING)
  // =========================
  const createOrder = async (data: OrderCreateData): Promise<Order> => {
    setLoading(true);
    setError(null);
    try {
      const res = await OrderService.createOrder(data);
      setOrders(prev => [res.data, ...prev]);
      return res.data;
    } catch (err: any) {
      setError(err?.message || 'Order creation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE STATUS (ADMIN)
  // =========================
  const updateOrderStatus = async (
    id: string,
    status: Order['status']
  ): Promise<Order> => {
    setLoading(true);
    setError(null);
    try {
      const res = await OrderService.updateOrderStatus(id, status);
      setOrders(prev =>
        Array.isArray(prev)
          ? prev.filter(Boolean).map(o =>
              o.id === id ? res.data : o
            )
          : []
      );
      return res.data;
    } catch (err: any) {
      setError(err?.message || 'Status update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await OrderService.deleteOrder(id);
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (err: any) {
      setError(err?.message || 'Delete order failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        error,
        getAllOrders,
        deleteOrder,
        getMyOrders,
        getOrderById,
        createOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};
