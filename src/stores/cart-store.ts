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
  add: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

type HydrationState = {
  // Fica false ate o AsyncStorage responder, para a tela nao piscar vazia.
  hasHydrated: boolean;
};

// Fora da store persistida de proposito: qualquer setState nela grava no
// storage, e marcar "pronto" nao deve disparar outra escrita.
export const useCartHydration = create<HydrationState>(() => ({
  hasHydrated: false,
}));

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
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      // A leitura comeca em hydrateCart(), chamada no layout raiz depois de
      // montar: a exportacao estatica do web renderiza sem window/localStorage.
      skipHydration: true,
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn("Nao foi possivel ler o carrinho salvo.", error);
        }

        // Marca como pronto mesmo com erro, senao a tela fica carregando.
        useCartHydration.setState({ hasHydrated: true });
      },
    }
  )
);

export function hydrateCart(): Promise<void> {
  return useCartStore.persist.rehydrate() ?? Promise.resolve();
}

export function useCartHydrated(): boolean {
  return useCartHydration((state) => state.hasHydrated);
}
