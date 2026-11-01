'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '@/types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  subtotalUzs: number;
  totalItemsCount: number;
  appliedCoupon: string | null;
  discountUzs: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message?: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountUzs, setDiscountUzs] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chronova_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // LocalStorage error ignored
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('chronova_cart', JSON.stringify(items));
    } catch {
      // LocalStorage error ignored
    }
  }, [items]);

  const addItem = (product: Product, variant: ProductVariant | null = null, quantity: number = 1) => {
    const price = (product.sale_price_uzs || product.base_price_uzs) + (variant?.price_adjustment_uzs || 0);

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, product.stock_quantity);
        updated[existingIndex].quantity = newQty;
        return updated;
      }

      return [...prev, { product, variant, quantity, selectedPriceUzs: price }];
    });

    setIsOpen(true);
  };

  const removeItem = (productId: string, variantId?: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.variant?.id === variantId))
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.variant?.id === variantId) {
          const maxStock = item.product.stock_quantity;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscountUzs(0);
  };

  const subtotalUzs = items.reduce(
    (acc, item) => acc + item.selectedPriceUzs * item.quantity,
    0
  );

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const applyCoupon = async (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'CHRONOVA10') {
      const discount = Math.round(subtotalUzs * 0.1);
      setDiscountUzs(discount);
      setAppliedCoupon('CHRONOVA10');
      return { success: true };
    } else if (cleanCode === 'VIP500') {
      const discount = 500000;
      setDiscountUzs(discount);
      setAppliedCoupon('VIP500');
      return { success: true };
    }

    return { success: false, message: 'Yaroqsiz yoki muddati tugagan kupon' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountUzs(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotalUzs,
        totalItemsCount,
        appliedCoupon,
        discountUzs,
        applyCoupon,
        removeCoupon,
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
