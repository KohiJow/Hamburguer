import { formatCurrency } from "../format-currency";

// O Intl separa "R$" do valor com espaco duro.
function plain(text: string) {
  return text.replace(/\u00a0/g, " ");
}

describe("formatCurrency", () => {
  it("formata em real com duas casas decimais", () => {
    expect(plain(formatCurrency(24.9))).toBe("R$ 24,90");
  });

  it("formata zero", () => {
    expect(plain(formatCurrency(0))).toBe("R$ 0,00");
  });

  it("usa ponto como separador de milhar", () => {
    expect(plain(formatCurrency(1234.5))).toBe("R$ 1.234,50");
  });
});
