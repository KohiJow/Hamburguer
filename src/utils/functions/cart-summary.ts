import type { CartProduct } from "@/stores/helpers/cart-in-memory";

type Priced = Pick<CartProduct, "price" | "quantity">;

// Soma de float acumula lixo tipo 74.69999; arredonda para centavos.
export function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getItemSubtotal(item: Priced): number {
  return roundToCents(item.price * item.quantity);
}

export function getCartQuantity(items: readonly Pick<CartProduct, "quantity">[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(items: readonly Priced[]): number {
  return roundToCents(
    items.reduce((total, item) => total + item.price * item.quantity, 0)
  );
}
