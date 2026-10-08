import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  CART_STORAGE_KEY,
  hydrateCart,
  useCartHydration,
  useCartStore,
} from "../cart-store";
import { makeProduct } from "@/test-utils/factories";

const burger = makeProduct({ id: "1", title: "X-React" });
const drink = makeProduct({ id: "7", title: "Hmmm, coquinha!" });

async function readStoredProducts() {
  const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);

  if (!raw) {
    return undefined;
  }

  return JSON.parse(raw) as { state: Record<string, unknown> };
}

function resetStores() {
  useCartStore.setState({ products: [] });
  useCartHydration.setState({ hasHydrated: false });
}

beforeEach(async () => {
  await AsyncStorage.clear();
  resetStores();
  await hydrateCart();
});

describe("useCartStore", () => {
  it("marca como hidratado depois de ler o storage", () => {
    expect(useCartHydration.getState().hasHydrated).toBe(true);
  });

  it("adiciona, remove e limpa usando a logica do cart-in-memory", () => {
    const store = useCartStore.getState();

    store.add(burger);
    store.add(burger);
    store.add(drink);
    expect(useCartStore.getState().products.map((p) => [p.id, p.quantity])).toEqual([
      ["1", 2],
      ["7", 1],
    ]);

    store.remove("1");
    expect(useCartStore.getState().products.map((p) => [p.id, p.quantity])).toEqual([
      ["1", 1],
      ["7", 1],
    ]);

    store.clear();
    expect(useCartStore.getState().products).toEqual([]);
  });

  it("grava so os produtos no AsyncStorage", async () => {
    useCartStore.getState().add(burger);

    const stored = await readStoredProducts();

    expect(stored?.state).toEqual({ products: [{ ...burger, quantity: 1 }] });
  });

  // setState passa pelo persist e grava no storage, por isso o reset vem
  // antes de semear o valor que o teste quer ler.
  it("recupera o carrinho salvo quando o app abre de novo", async () => {
    resetStores();
    await AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ state: { products: [{ ...drink, quantity: 3 }] }, version: 0 })
    );

    await hydrateCart();

    expect(useCartHydration.getState().hasHydrated).toBe(true);
    expect(useCartStore.getState().products).toEqual([{ ...drink, quantity: 3 }]);
  });

  it("segue utilizavel quando o storage esta corrompido", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    resetStores();
    await AsyncStorage.setItem(CART_STORAGE_KEY, "nao e json");

    await hydrateCart();

    expect(useCartHydration.getState().hasHydrated).toBe(true);
    expect(useCartStore.getState().products).toEqual([]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
