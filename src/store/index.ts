import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface StoreState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
  
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number) => void;

  products: any[];
  setProducts: (products: any[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
  
  cart: [],
  addToCart: (item) => set((state) => {
    const existing = state.cart.find((c) => c.id === item.id);
    if (existing) {
      return {
        cart: state.cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        ),
      };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((c) => c.id !== id),
  })),
  clearCart: () => set({ cart: [] }),
  updateQuantity: (id, quantity) => set((state) => ({
    cart: state.cart.map((c) => c.id === id ? { ...c, quantity: Math.max(1, quantity) } : c)
  })),
}));
