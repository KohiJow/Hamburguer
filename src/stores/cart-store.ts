import { create } from "zustand";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { createJSONStorage, persist } from "zustand/middleware";

import type { Product } from "@/utils/data/products";

import * as cartInMemory from "./helpers/cart-in-memory";

import type { CartProduct } from "./helpers/cart-in-memory";

export type { CartProduct };

type CartState = {
  products: CartProduct[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      products: [],

      add: (product) =>
        set((state) => ({
          products: cartInMemory.add(state.products, product),
        })),

      remove: (productId) =>
        set((state) => ({
          products: cartInMemory.remove(state.products, productId),
        })),

      clear: () => set({ products: [] }),
    }),
    {
      name: "hamburguer:cart",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
