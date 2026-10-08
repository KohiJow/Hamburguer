import type { CartProduct } from "@/stores/helpers/cart-in-memory";

import { formatCurrency } from "./format-currency";
import { getCartTotal, getItemSubtotal } from "./cart-summary";

export type OrderInput = {
  items: readonly CartProduct[];
  address: string;
  storePhone: string | undefined;
};

export type OrderField = "items" | "address" | "storePhone";

export type OrderValidation =
  | { ok: true; address: string; storePhone: string }
  | { ok: false; field: OrderField; message: string };

export const ADDRESS_MIN_LENGTH = 8;

// Codigo do pais + DDD + numero, somente digitos (ex.: 5511999999999).
const STORE_PHONE_PATTERN = /^\d{10,15}$/;

export const ORDER_MESSAGES: Record<OrderField, string> = {
  items: "Adicione pelo menos um item ao carrinho.",
  address: "Informe o endereço de entrega com rua, número e bairro.",
  storePhone:
    "Número de WhatsApp da loja não configurado. Defina EXPO_PUBLIC_STORE_PHONE no .env com código do país, DDD e número, só dígitos.",
};

export function isValidStorePhone(phone: string | undefined): phone is string {
  return typeof phone === "string" && STORE_PHONE_PATTERN.test(phone);
}

export function validateAddress(address: string): string | undefined {
  return address.trim().length >= ADDRESS_MIN_LENGTH
    ? undefined
    : ORDER_MESSAGES.address;
}

export function validateOrder({
  items,
  address,
  storePhone,
}: OrderInput): OrderValidation {
  if (items.length === 0) {
    return { ok: false, field: "items", message: ORDER_MESSAGES.items };
  }

  const addressError = validateAddress(address);

  if (addressError) {
    return { ok: false, field: "address", message: addressError };
  }

  if (!isValidStorePhone(storePhone)) {
    return { ok: false, field: "storePhone", message: ORDER_MESSAGES.storePhone };
  }

  return { ok: true, address: address.trim(), storePhone };
}

export function buildOrderMessage(
  items: readonly CartProduct[],
  address: string
): string {
  return [
    "NOVO PEDIDO",
    "",
    `Entregar em: ${address}`,
    "",
    ...items.map(
      (item) =>
        `${item.quantity}x ${item.title} (${formatCurrency(getItemSubtotal(item))})`
    ),
    "",
    `Valor total: ${formatCurrency(getCartTotal(items))}`,
  ].join("\n");
}

export function buildWhatsAppUrl(storePhone: string, message: string): string {
  return `https://api.whatsapp.com/send?phone=${storePhone}&text=${encodeURIComponent(message)}`;
}

export function getStorePhone(): string | undefined {
  return process.env.EXPO_PUBLIC_STORE_PHONE;
}
