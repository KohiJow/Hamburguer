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

const PHONE_NUMBER = "5519988414402";

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

  function handleOder() {
    if (address.trim().length === 0) {
      return Alert.alert("Atenção", "Deve ser informado o endereço!");
    }

    const products = cartStore.products
      .map((product) => `\n ${product.quantity} ${product.title}`)
      .join("");

    const message = `
    🍔 NOVO PEDIDO
    \n Entregar em ${address}
    
    ${products}
    
    \n Valor total: ${total}`;

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
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
              onSubmitEditing={handleOder} // Chama a função
              submitBehavior="blurAndSubmit" // Muda o botao
              returnKeyType="next" // Muda o icone
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOder}>
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
