"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartContextType } from '@/types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Generate unique ID for cart items
  const generateId = (productId: string, variantId?: string) => {
    return `${productId}-${variantId || 'default'}-${Date.now()}`;
  };

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    console.log('Adding to cart:', newItem); 
    setItems(prevItems => {
      // Check if item with same product and variant already exists
      const existingItemIndex = prevItems.findIndex(
        item => item.productId === newItem.productId && item.variantId === newItem.variantId
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = Math.min(
          existingItem.quantity + newItem.quantity,
          existingItem.maxStock
        );
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        };
        return updatedItems;
      } else {
        // Add new item
        const itemWithId: CartItem = {
          ...newItem,
          id: generateId(newItem.productId, newItem.variantId)
        };
        return [...prevItems, itemWithId];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            quantity: Math.min(quantity, item.maxStock)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};