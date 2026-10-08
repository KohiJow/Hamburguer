import { CATEGORIES, MENU, PRODUCTS, findProductById } from "../products";

describe("cardapio", () => {
  it("tem ids unicos", () => {
    const ids = PRODUCTS.map((product) => product.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("junta os produtos de todas as secoes na mesma ordem", () => {
    const fromSections = MENU.flatMap((section) => section.data);

    expect(PRODUCTS).toEqual(fromSections);
  });

  it("tem uma categoria por secao e nenhuma secao vazia", () => {
    expect(CATEGORIES).toEqual(MENU.map((section) => section.title));
    expect(MENU.every((section) => section.data.length > 0)).toBe(true);
  });

  it("todo produto tem preco positivo, titulo e imagens", () => {
    for (const product of PRODUCTS) {
      expect(product.price).toBeGreaterThan(0);
      expect(product.title.trim()).not.toBe("");
      expect(product.cover).toBeDefined();
      expect(product.thumbnail).toBeDefined();
    }
  });
});

describe("findProductById", () => {
  it("acha pelo id em string", () => {
    expect(findProductById("1")?.title).toBe("X-React");
  });

  it("usa o primeiro valor quando a rota entrega uma lista", () => {
    expect(findProductById(["7", "1"])?.title).toBe("Hmmm, coquinha!");
  });

  it("devolve undefined para id desconhecido, vazio ou ausente", () => {
    expect(findProductById("999")).toBeUndefined();
    expect(findProductById("")).toBeUndefined();
    expect(findProductById([])).toBeUndefined();
    expect(findProductById(undefined)).toBeUndefined();
  });
});
