import { create } from "zustand";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { createJSONStorage, persist } from "zustand/middleware";

import type { Product } from "@/utils/data/products";

import * as cartInMemory from "./helpers/cart-in-memory";

import type { CartProduct } from "./helpers/cart-in-memory";

export type { CartProduct };

export const CART_STORAGE_KEY = "hamburguer:cart";

type CartState = {
  products: CartProduct[];
  // Fica false ate o AsyncStorage responder, para a tela nao piscar vazia.
  hasHydrated: boolean;
  add: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      products: [],
      hasHydrated: false,

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
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ products: state.products }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn("Nao foi possivel ler o carrinho salvo.", error);
        }

        // Roda depois que o AsyncStorage responde, com a store ja criada.
        // Marca como pronto mesmo com erro, senao a tela fica carregando.
        useCartStore.setState({ hasHydrated: true });
      },
    }
  )
);
