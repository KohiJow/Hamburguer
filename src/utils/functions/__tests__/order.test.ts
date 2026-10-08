import {
  ADDRESS_MIN_LENGTH,
  ORDER_MESSAGES,
  buildOrderMessage,
  buildWhatsAppUrl,
  isValidStorePhone,
  validateAddress,
  validateOrder,
} from "../order";
import { makeCartProduct } from "@/test-utils/factories";

const items = [
  makeCartProduct({ id: "1", title: "X-React", price: 24.9, quantity: 2 }),
  makeCartProduct({ id: "7", title: "Hmmm, coquinha!", price: 6.9, quantity: 1 }),
];

const address = "Rua das Flores, 123, Centro";

const storePhone = "5511999999999";

// formatCurrency usa espaco duro entre R$ e o valor.
function plain(text: string) {
  return text.replace(/ /g, " ");
}

describe("isValidStorePhone", () => {
  it("aceita so digitos com codigo do pais e DDD", () => {
    expect(isValidStorePhone("5511999999999")).toBe(true);
    expect(isValidStorePhone("551133334444")).toBe(true);
  });

  it("recusa vazio, indefinido, mascara e tamanho errado", () => {
    expect(isValidStorePhone(undefined)).toBe(false);
    expect(isValidStorePhone("")).toBe(false);
    expect(isValidStorePhone("+55 (11) 99999-9999")).toBe(false);
    expect(isValidStorePhone("999")).toBe(false);
  });
});

describe("validateAddress", () => {
  it("aceita endereco com o tamanho minimo", () => {
    expect(validateAddress("Rua A, 10")).toBeUndefined();
    expect(validateAddress("x".repeat(ADDRESS_MIN_LENGTH))).toBeUndefined();
  });

  it("recusa vazio, so espacos e muito curto", () => {
    expect(validateAddress("")).toBe(ORDER_MESSAGES.address);
    expect(validateAddress("    ")).toBe(ORDER_MESSAGES.address);
    expect(validateAddress("Rua A")).toBe(ORDER_MESSAGES.address);
  });
});

describe("validateOrder", () => {
  it("recusa carrinho vazio antes de olhar o resto", () => {
    expect(validateOrder({ items: [], address, storePhone })).toEqual({
      ok: false,
      field: "items",
      message: ORDER_MESSAGES.items,
    });
  });

  it("recusa endereco vazio", () => {
    expect(validateOrder({ items, address: "   ", storePhone })).toEqual({
      ok: false,
      field: "address",
      message: ORDER_MESSAGES.address,
    });
  });

  it("recusa telefone da loja ausente ou invalido", () => {
    expect(validateOrder({ items, address, storePhone: undefined })).toEqual({
      ok: false,
      field: "storePhone",
      message: ORDER_MESSAGES.storePhone,
    });

    expect(validateOrder({ items, address, storePhone: "11 9999" }).ok).toBe(
      false
    );
  });

  it("devolve endereco sem espacos nas pontas quando esta tudo certo", () => {
    expect(
      validateOrder({ items, address: `  ${address}  `, storePhone })
    ).toEqual({ ok: true, address, storePhone });
  });
});

describe("buildOrderMessage", () => {
  it("lista itens com subtotal, endereco e total", () => {
    const message = plain(buildOrderMessage(items, address));

    expect(message.split("\n")).toEqual([
      "NOVO PEDIDO",
      "",
      "Entregar em: Rua das Flores, 123, Centro",
      "",
      "2x X-React (R$ 49,80)",
      "1x Hmmm, coquinha! (R$ 6,90)",
      "",
      "Valor total: R$ 56,70",
    ]);
  });
});

describe("buildWhatsAppUrl", () => {
  it("monta a url da api do whatsapp com a mensagem codificada", () => {
    const url = buildWhatsAppUrl(storePhone, "Olá\nR$ 1,00 & cia");

    expect(url).toBe(
      "https://api.whatsapp.com/send?phone=5511999999999&text=Ol%C3%A1%0AR%24%201%2C00%20%26%20cia"
    );
  });

  it("decodifica de volta para a mesma mensagem", () => {
    const message = buildOrderMessage(items, address);
    const url = new URL(buildWhatsAppUrl(storePhone, message));

    expect(url.searchParams.get("phone")).toBe(storePhone);
    expect(url.searchParams.get("text")).toBe(message);
  });
});
