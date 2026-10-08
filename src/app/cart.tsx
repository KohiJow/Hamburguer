import { View, Text, ScrollView, Alert, Linking } from "react-native";

import { Header } from "@/components/header";

import { productCartProps, useCartStore } from "@/stores/cart-store";

import { Product } from "@/components/products";

import { formatCurrency } from "@/utils/functions/format-currency";

import { Input } from "@/components/input";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Button } from "@/components/button";

import { Feather } from "@expo/vector-icons";

import { LinkButton } from "@/components/link-button";

import { useState } from "react";

import { useNavigation } from "expo-router";

const PHONE_NUMBER = process.env.EXPO_PUBLIC_STORE_PHONE;

export default function Cart() {
  const [address, setAddress] = useState("");
  const cartStore = useCartStore();
  const navigation = useNavigation();

  const total = formatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  function handleProductRemove(product: productCartProps) {
    Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
      {
        text: "Cancelar",
      },
      {
        text: "Remover",
        onPress: () => cartStore.remove(product.id),
      },
    ]);
  }

  function handleOrder() {
    if (cartStore.products.length === 0) {
      return Alert.alert("Atenção", "Adicione pelo menos um item ao carrinho.");
    }

    if (address.trim().length === 0) {
      return Alert.alert("Atenção", "Deve ser informado o endereço!");
    }

    if (!PHONE_NUMBER) {
      return Alert.alert(
        "Atenção",
        "Número de WhatsApp da loja não configurado. Defina EXPO_PUBLIC_STORE_PHONE no .env."
      );
    }

    const message = [
      "NOVO PEDIDO",
      "",
      `Entregar em: ${address.trim()}`,
      "",
      ...cartStore.products.map(
        (product) => `${product.quantity}x ${product.title}`
      ),
      "",
      `Valor total: ${total}`,
    ].join("\n");

    Linking.openURL(
      `https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(
        message
      )}`
    );

    cartStore.clear();
    navigation.goBack();
  }

  return (
    <View className="flex-1 pt-8">
      <KeyboardAwareScrollView
        showsHorizontalScrollIndicator={false}
        extraHeight={100}
      >
        <Header title="Seu Carrinho" />
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length > 0 ? (
              <View className="border-b border-slate-700">
                {cartStore.products.map((product) => (
                  <Product
                    key={product.id}
                    data={product}
                    onPress={() => handleProductRemove(product)}
                  />
                ))}
              </View>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Seu carrinho está vazio
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4">
              <Text className="text-white text-xl font-subtitle">Total</Text>
              <Text className="text-lime-400 text-2xl font-heading">
                {total}
              </Text>
            </View>

            <Input
              placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento"
              onChangeText={setAddress}
              onSubmitEditing={handleOrder}
              submitBehavior="blurAndSubmit"
              returnKeyType="next"
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
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
