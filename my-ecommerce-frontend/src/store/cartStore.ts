import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  stock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;

  // Computed values
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
}

// Helper function to calculate cart totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return { totalItems, subtotal, shipping, total };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      loading: false,
      error: null,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            // Check if adding more would exceed stock
            if (existingItem.quantity + 1 > item.stock) {
              toast.error("Cannot add more items than available in stock");
              return state;
            }

            if (item.stock === 0) {
              toast.error("Item is out of stock");
              return state;
            }

            const newItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
            const totals = calculateTotals(newItems);

            return {
              items: newItems,
              ...totals,
            };
          }

          const newItems = [...state.items, { ...item, quantity: 1 }];
          const totals = calculateTotals(newItems);

          return {
            items: newItems,
            ...totals,
          };
        });
        toast.success("Item added to cart");
      },

      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          const totals = calculateTotals(newItems);

          return {
            items: newItems,
            ...totals,
          };
        });
        toast.success("Item removed from cart");
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;

          if (quantity > item.stock) {
            toast.error("Cannot add more items than available in stock");
            return state;
          }

          if (quantity <= 0) {
            const newItems = state.items.filter((i) => i.id !== id);
            const totals = calculateTotals(newItems);

            return {
              items: newItems,
              ...totals,
            };
          }

          const newItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          );
          const totals = calculateTotals(newItems);

          return {
            items: newItems,
            ...totals,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          subtotal: 0,
          shipping: 0,
          total: 0,
        });
        toast.success("Cart cleared");
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      // Initial computed values
      totalItems: 0,
      subtotal: 0,
      shipping: 0,
      total: 0,
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // Only persist if there are items in the cart
        if (state.items.length === 0) {
          return {};
        }
        return {
          items: state.items,
          totalItems: state.totalItems,
          subtotal: state.subtotal,
          shipping: state.shipping,
          total: state.total,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state && state.items.length > 0) {
          const totals = calculateTotals(state.items);
          state.totalItems = totals.totalItems;
          state.subtotal = totals.subtotal;
          state.shipping = totals.shipping;
          state.total = totals.total;
        }
      },
    }
  )
);
