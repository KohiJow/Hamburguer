import {
  getCartQuantity,
  getCartTotal,
  getItemSubtotal,
  roundToCents,
} from "../cart-summary";
import { makeCartProduct } from "@/test-utils/factories";

describe("roundToCents", () => {
  it("arredonda para duas casas", () => {
    expect(roundToCents(74.69999999999999)).toBe(74.7);
    expect(roundToCents(10.005)).toBe(10.01);
    expect(roundToCents(0)).toBe(0);
  });
});

describe("getItemSubtotal", () => {
  it("multiplica preco pela quantidade", () => {
    expect(getItemSubtotal({ price: 24.9, quantity: 3 })).toBe(74.7);
  });
});

describe("getCartQuantity", () => {
  it("devolve zero para carrinho vazio", () => {
    expect(getCartQuantity([])).toBe(0);
  });

  it("soma a quantidade de todos os itens", () => {
    const items = [
      makeCartProduct({ id: "1", quantity: 2 }),
      makeCartProduct({ id: "7", quantity: 3 }),
    ];

    expect(getCartQuantity(items)).toBe(5);
  });
});

describe("getCartTotal", () => {
  it("devolve zero para carrinho vazio", () => {
    expect(getCartTotal([])).toBe(0);
  });

  it("soma preco vezes quantidade de cada item", () => {
    const items = [
      makeCartProduct({ id: "1", price: 24.9, quantity: 2 }),
      makeCartProduct({ id: "7", price: 6.9, quantity: 1 }),
    ];

    expect(getCartTotal(items)).toBe(56.7);
  });

  it("nao acumula erro de ponto flutuante", () => {
    const items = [makeCartProduct({ price: 0.1, quantity: 3 })];

    expect(getCartTotal(items)).toBe(0.3);
  });
});
