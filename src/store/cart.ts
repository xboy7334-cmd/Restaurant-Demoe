import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/api';

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartLine[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product) =>
        set((state) => {
          const existing = state.items.find((line) => line.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((line) =>
                line.product.id === product.id
                  ? { ...line, quantity: line.quantity + 1 }
                  : line,
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        }),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((line) => line.product.id !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((line) => line.product.id !== productId)
              : state.items.map((line) =>
                  line.product.id === productId ? { ...line, quantity } : line,
                ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'your-choice-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function cartCount(items: CartLine[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(items: CartLine[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}
