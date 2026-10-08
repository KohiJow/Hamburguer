import { formatCurrency } from "../format-currency";

describe("formatCurrency", () => {
  it("formata em real com duas casas decimais", () => {
    expect(formatCurrency(24.9).replace(/ /g, " ")).toBe("R$ 24,90");
  });

  it("formata zero", () => {
    expect(formatCurrency(0).replace(/ /g, " ")).toBe("R$ 0,00");
  });

  it("usa ponto como separador de milhar", () => {
    expect(formatCurrency(1234.5).replace(/ /g, " ")).toBe("R$ 1.234,50");
  });
});
