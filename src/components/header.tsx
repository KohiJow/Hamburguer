import { Image, View, Text, TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";

import { Link } from "expo-router";

import { colors } from "@/theme";

type HeaderProps = {
  title: string;
  cartQuantityItem?: number;
};

export function formatBadge(quantity: number): string {
  return quantity > 9 ? "9+" : String(quantity);
}

export function cartAccessibilityLabel(quantity: number): string {
  return quantity === 1
    ? "Abrir carrinho, 1 item"
    : `Abrir carrinho, ${quantity} itens`;
}

export function Header({ title, cartQuantityItem = 0 }: HeaderProps) {
  return (
    <View className="flex-row items-center border-b border-border pb-5 mx-5">
      <View className="flex-1">
        <Image
          source={require("@/assets/logo.png")}
          className="h-6 w-32"
          accessible={false}
        />
        <Text
          className="text-foreground text-xl font-heading mt-2"
          accessibilityRole="header"
        >
          {title}
        </Text>
      </View>

      {cartQuantityItem > 0 && (
        <Link href={"/cart"} asChild>
          <TouchableOpacity
            className="w-12 h-12 items-center justify-center"
            accessibilityRole="link"
            accessibilityLabel={cartAccessibilityLabel(cartQuantityItem)}
            activeOpacity={0.7}
          >
            <Feather name="shopping-bag" color={colors.foreground} size={24} />
            <View className="absolute top-0 right-0 w-5 h-5 rounded-full bg-badge items-center justify-center">
              <Text className="text-ink font-bold text-xs">
                {formatBadge(cartQuantityItem)}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}
