'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string | null;
  shopId: string;
  shopName: string;
  shopPhone: string;
}

export type CartItemInput = Omit<CartItem, 'quantity'>;

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
  shopInfo: { id: string; name: string; phone: string } | null;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'local_cart_ai_items_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. SSR Hydration Guard: Load cart state from localStorage safely on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Persist to localStorage whenever items change (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      } catch (err) {
        console.error('Failed to save cart to localStorage:', err);
      }
    }
  }, [items, isHydrated]);

  // 3. Cart Actions
  const addItem = (newItem: CartItemInput) => {
    setItems((prev) => {
      // If adding item from a different shop, confirm reset or overwrite
      if (prev.length > 0 && prev[0].shopId !== newItem.shopId) {
        const confirmSwitch = window.confirm(
          `Your cart contains items from "${prev[0].shopName}". Switching stores will reset your cart. Proceed?`
        );
        if (!confirmSwitch) return prev;
        return [{ ...newItem, quantity: 1 }];
      }

      const existingIndex = prev.findIndex((i) => i.id === newItem.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsOpen(true); // Auto-open drawer on add
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shopInfo =
    items.length > 0
      ? { id: items[0].shopId, name: items[0].shopName, phone: items[0].shopPhone }
      : null;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        totalItems,
        totalPrice,
        shopInfo,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
