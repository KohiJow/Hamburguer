import { add, remove } from "../cart-in-memory";
import { productCartProps } from "../../cart-store";

const burger = {
  id: "1",
  title: "X-React",
  price: 24.9,
  description: "lanche",
  cover: 1,
  thumbnail: 1,
  ingredients: ["Pão brioche;"],
} as unknown as productCartProps;

const drink = {
  id: "7",
  title: "Hmmm, coquinha!",
  price: 6.9,
  description: "bebida",
  cover: 2,
  thumbnail: 2,
  ingredients: [],
} as unknown as productCartProps;

describe("add", () => {
  it("insere o produto com quantidade 1 quando o carrinho esta vazio", () => {
    const result = add([], burger);

    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(1);
  });

  it("soma na quantidade em vez de duplicar o produto", () => {
    const result = add(add([], burger), burger);

    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(2);
  });

  it("mantem os produtos que ja estavam no carrinho", () => {
    const result = add(add([], burger), drink);

    expect(result.map((product) => product.id)).toEqual(["1", "7"]);
  });

  it("nao altera o array recebido", () => {
    const cart: productCartProps[] = [];
    add(cart, burger);

    expect(cart).toHaveLength(0);
  });
});

describe("remove", () => {
  it("diminui uma unidade quando a quantidade e maior que 1", () => {
    const cart = add(add([], burger), burger);
    const result = remove(cart, "1");

    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(1);
  });

  it("tira o produto do carrinho quando sobra apenas 1 unidade", () => {
    const cart = add([], burger);
    const result = remove(cart, "1");

    expect(result).toHaveLength(0);
  });

  it("ignora id que nao esta no carrinho", () => {
    const cart = add([], burger);
    const result = remove(cart, "999");

    expect(result).toEqual(cart);
  });
});
