import { Image, ScrollView, Text, View } from "react-native";

import { useLocalSearchParams, Redirect } from "expo-router";

import { Feather } from "@expo/vector-icons";

import { Button } from "@/components/button";
import { LinkButton } from "@/components/link-button";

import { useCartStore } from "@/stores/cart-store";

import { findProductById } from "@/utils/data/products";
import { formatCurrency } from "@/utils/functions/format-currency";
import { goBackOrHome } from "@/utils/functions/navigation";

export default function Product() {
  const addToCart = useCartStore((state) => state.add);
  const { id } = useLocalSearchParams<{ id: string }>();

  const product = findProductById(id);

  if (!product) {
    return <Redirect href={"/"} />;
  }

  function handleAddToCart() {
    if (product) {
      addToCart(product);
    }

    goBackOrHome();
  }

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Image
          source={product.cover}
          className="w-full h-52"
          resizeMode="cover"
          accessible={false}
        />

        <View className="p-5 mt-8">
          <Text
            className="text-foreground text-xl font-heading"
            accessibilityRole="header"
          >
            {product.title}
          </Text>

          <Text className="text-primary text-2xl font-heading my-2">
            {formatCurrency(product.price)}
          </Text>

          <Text className="text-muted font-body text-base leading-6 mb-6">
            {product.description}
          </Text>

          {product.ingredients.length > 0 && (
            <View accessibilityRole="list">
              <Text className="text-soft font-subtitle text-base mb-2">
                Ingredientes
              </Text>

              {product.ingredients.map((ingredient) => (
                <View key={ingredient} className="flex-row">
                  <Text className="text-muted font-body text-base leading-6 w-4">
                    {"\u2022"}
                  </Text>
                  <Text className="text-muted font-body text-base leading-6 flex-1">
                    {ingredient}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View className="p-5 pb-8 gap-5">
        <Button onPress={handleAddToCart}>
          <Button.Icon>
            <Feather name="plus-circle" size={20} />
          </Button.Icon>
          <Button.Text>Adicionar ao pedido</Button.Text>
        </Button>

        <LinkButton title="Voltar ao cardápio" href={"/"} />
      </View>
    </View>
  );
}
