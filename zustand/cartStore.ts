import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  totalQty: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((x) => x.id === item.id);
          if (existing) {
            return {
              items: state.items.map((x) =>
                x.id === item.id ? { ...x, qty: x.qty + qty } : x
              ),
            };
          }
          return { items: [...state.items, { ...item, qty }] };
        }),

      removeItem: (id) => set((state) => ({ items: state.items.filter((x) => x.id !== id) })),

      setQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)),
        })),

      clear: () => set({ items: [] }),

      totalQty: () => get().items.reduce((sum, x) => sum + x.qty, 0),
      totalPrice: () => get().items.reduce((sum, x) => sum + x.price * x.qty, 0),
    }),
    { name: "cart" }
  )
);
