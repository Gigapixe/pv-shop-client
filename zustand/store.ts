import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CategoryState {
  isOpen: boolean;
  openCategory: () => void;
  closeCategory: () => void;
}
export const useCategoryStore = create<CategoryState>((set) => ({
  isOpen: false,
  openCategory: () => set({ isOpen: true }),
  closeCategory: () => set({ isOpen: false }),
}));

// Cart item type
export type CartItemType = "WALLET_LOAD" | "DIGITAL_PINS" | "TOPUP_PINS";

export interface CartItem {
  _id: string;
  productId?: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  isGiftCard?: boolean;
  type?: CartItemType;
  topupInputValues?: any;
  allowedPaymentMethods?: string[];
}

// Helper to calculate common payment restrictions
const calculateRestrictions = (items: CartItem[]) => {
  if (items.length === 0) return [];

  // Start with the first item's methods
  const first = items[0].allowedPaymentMethods;
  let common = first ? [...first] : [];

  if (!first) return [];

  for (let i = 1; i < items.length; i++) {
    const current = items[i].allowedPaymentMethods || [];
    common = common.filter((c) => current.includes(c));
  }

  return common;
};

// Cart store with persistence
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  /**
   * Returns true when the item was added, false when rejected (type conflict)
   */
  addToCart: (
    item: Omit<CartItem, "quantity"> & { paymentMethods?: string[] },
  ) => boolean;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  /** top-level meta type for the whole cart (persisted) */
  metaType: CartItemType | null;
  paymentRestrictions: string[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      metaType: null,
      paymentRestrictions: [],
      addToCart: (item) => {
        const items = get().items;
        const incomingType = (item.type ?? "DIGITAL_PINS") as CartItemType;
        const currentMeta = get().metaType;

        // enforce mutual exclusivity between top-level metaType and incoming item
        if (currentMeta && currentMeta !== incomingType) {
          return false; // rejected due to mixed types
        }

        // if cart is empty, set the metaType
        if (!currentMeta && items.length === 0) {
          set({ metaType: incomingType });
        }

        const existingItem = items.find((i) => i._id === item._id);
        const incomingMethods = item.paymentMethods;
        let newItems;

        if (existingItem) {
          newItems = items.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        } else {
          const { paymentMethods, ...rest } = item;
          newItems = [
            ...items,
            { ...rest, quantity: 1, allowedPaymentMethods: incomingMethods },
          ];
        }

        // Recalculate restrictions
        const newRestrictions = calculateRestrictions(newItems);

        set({ items: newItems, paymentRestrictions: newRestrictions });
        return true;
      },
      removeFromCart: (id) => {
        const remaining = get().items.filter((item) => item._id !== id);

        // Recalculate restrictions
        let newRestrictions: string[] = [];
        let newMetaType = get().metaType;

        if (remaining.length === 0) {
          newMetaType = null;
        } else {
          newRestrictions = calculateRestrictions(remaining);
        }

        set({
          items: remaining,
          metaType: newMetaType,
          paymentRestrictions: newRestrictions,
        });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        const updated = get().items.map((item) =>
          item._id === id ? { ...item, quantity } : item,
        );
        set({ items: updated });
        if (updated.length === 0) set({ metaType: null });
      },
      clearCart: () =>
        set({ items: [], metaType: null, paymentRestrictions: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "gamingty-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        metaType: state.metaType,
        paymentRestrictions: state.paymentRestrictions,
      }),
    },
  ),
);

// Theme store with persistence
export const useThemeStore = create<{
  theme: "light" | "dark";
  toggleTheme: () => void;
}>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () =>
        set({ theme: get().theme === "light" ? "dark" : "light" }),
    }),
    {
      name: "gamingty-theme",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
