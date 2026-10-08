import { cartAccessibilityLabel, formatBadge } from "../header";
import { decreaseLabel } from "../quantity-stepper";

describe("formatBadge", () => {
  it("mostra o numero ate 9 e 9+ acima disso", () => {
    expect(formatBadge(1)).toBe("1");
    expect(formatBadge(9)).toBe("9");
    expect(formatBadge(10)).toBe("9+");
    expect(formatBadge(42)).toBe("9+");
  });
});

describe("cartAccessibilityLabel", () => {
  it("concorda o plural com a quantidade", () => {
    expect(cartAccessibilityLabel(1)).toBe("Abrir carrinho, 1 item");
    expect(cartAccessibilityLabel(3)).toBe("Abrir carrinho, 3 itens");
  });
});

describe("decreaseLabel", () => {
  it("avisa que vai remover quando sobra uma unidade", () => {
    expect(decreaseLabel(1, "X-React")).toBe("Remover X-React do carrinho");
    expect(decreaseLabel(0, "X-React")).toBe("Remover X-React do carrinho");
  });

  it("so diminui quando tem mais de uma unidade", () => {
    expect(decreaseLabel(2, "X-React")).toBe("Diminuir X-React");
  });
});
