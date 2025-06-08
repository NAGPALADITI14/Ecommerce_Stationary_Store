"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
}

export interface Address {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface TrackingStep {
  status: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  address: Address;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  orderDate: string;
  estimatedDelivery: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  paymentId: string;
  trackingSteps: TrackingStep[];
}

interface OrderContextType {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'trackingSteps'>) => void;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

// Generate random delivery estimates (4-7 days)
const generateDeliveryEstimate = (): Date => {
  const days = Math.floor(Math.random() * 4) + 4; // 4-7 days
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return deliveryDate;
};

// Generate tracking steps based on delivery estimate
const generateTrackingSteps = (orderDate: Date, estimatedDelivery: Date): TrackingStep[] => {
  const steps: TrackingStep[] = [
    {
      status: 'Order Confirmed',
      description: 'Your order has been confirmed and is being prepared',
      timestamp: orderDate.toISOString(),
      completed: true
    },
    {
      status: 'Processing',
      description: 'Your order is being processed and packed',
      timestamp: new Date(orderDate.getTime() + (1 * 24 * 60 * 60 * 1000)).toISOString(), // +1 day
      completed: false
    },
    {
      status: 'Shipped',
      description: 'Your order has been shipped and is on its way',
      timestamp: new Date(orderDate.getTime() + (2 * 24 * 60 * 60 * 1000)).toISOString(), // +2 days
      completed: false
    },
    {
      status: 'Out for Delivery',
      description: 'Your order is out for delivery and will arrive today',
      timestamp: new Date(estimatedDelivery.getTime() - (1 * 24 * 60 * 60 * 1000)).toISOString(), // -1 day from delivery
      completed: false
    },
    {
      status: 'Delivered',
      description: 'Your order has been delivered successfully',
      timestamp: estimatedDelivery.toISOString(),
      completed: false
    }
  ];
  
  return steps;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('userOrders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          orderDate: new Date(order.orderDate),
          estimatedDelivery: new Date(order.estimatedDelivery),
          trackingSteps: order.trackingSteps.map((step: any) => ({
            ...step,
            timestamp: new Date(step.timestamp)
          }))
        }));
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('userOrders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'trackingSteps'>) => {
    const orderDate = new Date();
    const estimatedDelivery = generateDeliveryEstimate();
    const trackingSteps = generateTrackingSteps(orderDate, estimatedDelivery);
    
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: `ORD${Date.now().toString().slice(-8)}`,
      orderDate: orderDate.toISOString(),
      trackingSteps,
      status: 'confirmed'
    };

    setOrders(prev => [newOrder, ...prev]);
    
    // Simulate order status progression
    setTimeout(() => updateOrderStatus(newOrder.id, 'processing'), 2000);
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedSteps = order.trackingSteps.map((step, index) => {
          // Update completed status based on order status
          switch (status) {
            case 'confirmed':
              return { ...step, completed: index === 0 };
            case 'processing':
              return { ...step, completed: index <= 1 };
            case 'shipped':
              return { ...step, completed: index <= 2 };
            case 'out_for_delivery':
              return { ...step, completed: index <= 3 };
            case 'delivered':
              return { ...step, completed: true };
            default:
              return step;
          }
        });

        return {
          ...order,
          status,
          trackingSteps: updatedSteps
        };
      }
      return order;
    }));
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      getOrderById,
      updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};