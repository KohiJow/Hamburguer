import type { CartProduct } from "@/stores/helpers/cart-in-memory";
import type { Product } from "@/utils/data/products";

// Nos testes as imagens sao so um numero, como o require() devolve no app.
export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "1",
    title: "X-React",
    price: 24.9,
    description: "lanche",
    cover: 1,
    thumbnail: 1,
    ingredients: ["Pão brioche"],
    ...overrides,
  };
}

export function makeCartProduct(
  overrides: Partial<CartProduct> = {}
): CartProduct {
  return { ...makeProduct(), quantity: 1, ...overrides };
}
