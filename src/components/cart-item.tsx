import { Image, Text, View } from "react-native";

import type { CartProduct } from "@/stores/helpers/cart-in-memory";

import { formatCurrency } from "@/utils/functions/format-currency";
import { getItemSubtotal } from "@/utils/functions/cart-summary";

import { QuantityStepper } from "./quantity-stepper";

type CartItemProps = {
  data: CartProduct;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function CartItem({ data, onIncrease, onDecrease }: CartItemProps) {
  return (
    <View className="w-full flex-row items-center py-3 border-b border-border">
      <Image
        source={data.thumbnail}
        className="w-16 h-16 rounded-md"
        accessible={false}
      />

      <View className="flex-1 ml-3 mr-2">
        <Text className="text-soft font-subtitle text-base" numberOfLines={1}>
          {data.title}
        </Text>

        <Text className="text-muted font-body text-xs mt-0.5">
          {formatCurrency(data.price)} cada
        </Text>

        <Text className="text-primary font-heading text-sm mt-1">
          {formatCurrency(getItemSubtotal(data))}
        </Text>
      </View>

      <QuantityStepper
        quantity={data.quantity}
        itemName={data.title}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
      />
    </View>
  );
}
