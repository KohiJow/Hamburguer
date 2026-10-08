import { Text, TouchableOpacity, View } from "react-native";

import { Feather } from "@expo/vector-icons";

import { colors } from "@/theme";

type QuantityStepperProps = {
  quantity: number;
  itemName: string;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function decreaseLabel(quantity: number, itemName: string): string {
  return quantity <= 1
    ? `Remover ${itemName} do carrinho`
    : `Diminuir ${itemName}`;
}

export function QuantityStepper({
  quantity,
  itemName,
  onIncrease,
  onDecrease,
}: QuantityStepperProps) {
  const isLastUnit = quantity <= 1;

  return (
    <View className="flex-row items-center bg-surface rounded-md">
      <TouchableOpacity
        className="w-11 h-11 items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel={decreaseLabel(quantity, itemName)}
        activeOpacity={0.7}
        onPress={onDecrease}
      >
        <Feather
          name={isLastUnit ? "trash-2" : "minus"}
          size={18}
          color={isLastUnit ? colors.danger : colors.soft}
        />
      </TouchableOpacity>

      <Text
        className="text-soft font-heading text-base w-7 text-center"
        accessibilityLabel={`Quantidade: ${quantity}`}
      >
        {quantity}
      </Text>

      <TouchableOpacity
        className="w-11 h-11 items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel={`Aumentar ${itemName}`}
        activeOpacity={0.7}
        onPress={onIncrease}
      >
        <Feather name="plus" size={18} color={colors.soft} />
      </TouchableOpacity>
    </View>
  );
}
