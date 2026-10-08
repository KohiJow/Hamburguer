import { useState } from "react";
import { View, Text, Linking } from "react-native";

import { Link } from "expo-router";

import { Feather } from "@expo/vector-icons";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Button } from "@/components/button";
import { CartItem } from "@/components/cart-item";
import { EmptyState } from "@/components/empty-state";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { LinkButton } from "@/components/link-button";
import { Loading } from "@/components/loading";

import { CartProduct, useCartHydrated, useCartStore } from "@/stores/cart-store";

import { getCartTotal } from "@/utils/functions/cart-summary";
import { confirmAction, showMessage } from "@/utils/functions/dialog";
import { formatCurrency } from "@/utils/functions/format-currency";
import { goBackOrHome } from "@/utils/functions/navigation";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  getStorePhone,
  validateOrder,
} from "@/utils/functions/order";

export default function Cart() {
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState<string>();
  const [isSending, setIsSending] = useState(false);

  const products = useCartStore((state) => state.products);
  const hasHydrated = useCartHydrated();
  const addProduct = useCartStore((state) => state.add);
  const removeProduct = useCartStore((state) => state.remove);
  const clearCart = useCartStore((state) => state.clear);

  const total = formatCurrency(getCartTotal(products));

  async function handleDecrease(product: CartProduct) {
    if (product.quantity > 1) {
      removeProduct(product.id);
      return;
    }

    const confirmed = await confirmAction(
      "Remover",
      `Deseja remover ${product.title} do carrinho?`,
      "Remover"
    );

    if (confirmed) {
      removeProduct(product.id);
    }
  }

  function handleAddressChange(text: string) {
    setAddress(text);

    if (addressError) {
      setAddressError(undefined);
    }
  }

  async function handleOrder() {
    const validation = validateOrder({
      items: products,
      address,
      storePhone: getStorePhone(),
    });

    if (!validation.ok) {
      if (validation.field === "address") {
        setAddressError(validation.message);
        return;
      }

      showMessage("Atenção", validation.message);
      return;
    }

    const url = buildWhatsAppUrl(
      validation.storePhone,
      buildOrderMessage(products, validation.address)
    );

    setIsSending(true);

    try {
      await Linking.openURL(url);
    } catch {
      showMessage(
        "Não foi possível abrir o WhatsApp",
        "Confira se o aplicativo está instalado e tente de novo. Seu carrinho continua salvo."
      );
      return;
    } finally {
      setIsSending(false);
    }

    // So limpa depois que o WhatsApp abriu, senao o pedido se perde.
    clearCart();
    goBackOrHome();
  }

  if (!hasHydrated) {
    return (
      <View className="flex-1 pt-8">
        <Header title="Seu carrinho" />
        <Loading message="Carregando carrinho" />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View className="flex-1 pt-8">
        <Header title="Seu carrinho" />

        <EmptyState
          icon="shopping-bag"
          title="Seu carrinho está vazio"
          description="Escolha algo no cardápio para começar o pedido."
        >
          <Link href={"/"} asChild>
            <Button>
              <Button.Text>Ver cardápio</Button.Text>
            </Button>
          </Link>
        </EmptyState>
      </View>
    );
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho" />

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        extraHeight={100}
      >
        <View accessibilityRole="list">
          {products.map((product) => (
            <CartItem
              key={product.id}
              data={product}
              onIncrease={() => addProduct(product)}
              onDecrease={() => void handleDecrease(product)}
            />
          ))}
        </View>

        <View
          className="flex-row gap-2 items-center mt-5 mb-5"
          accessible
          accessibilityLabel={`Total ${total}`}
        >
          <Text className="text-foreground text-xl font-subtitle">Total</Text>
          <Text className="text-primary text-2xl font-heading">{total}</Text>
        </View>

        <Input
          label="Endereço de entrega"
          placeholder="Rua, número, bairro, CEP e complemento"
          value={address}
          onChangeText={handleAddressChange}
          errorMessage={addressError}
          onSubmitEditing={() => void handleOrder()}
          submitBehavior="blurAndSubmit"
          returnKeyType="send"
        />
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={() => void handleOrder()} isLoading={isSending}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton title="Voltar ao cardápio" href={"/"} />
      </View>
    </View>
  );
}
