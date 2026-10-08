import { forwardRef } from "react";

import {
  TouchableOpacity,
  TouchableOpacityProps,
  ImageSourcePropType,
  Image,
  View,
  Text,
} from "react-native";

import { formatCurrency } from "@/utils/functions/format-currency";

type ProductCardData = {
  title: string;
  description: string;
  price: number;
  thumbnail: ImageSourcePropType;
};

type ProductCardProps = TouchableOpacityProps & {
  data: ProductCardData;
};

export const ProductCard = forwardRef<
  React.ComponentRef<typeof TouchableOpacity>,
  ProductCardProps
>(({ data, ...rest }, ref) => {
  const price = formatCurrency(data.price);

  return (
    <TouchableOpacity
      ref={ref}
      className="w-full flex-row items-center pb-4"
      accessibilityRole="link"
      accessibilityLabel={`${data.title}, ${price}`}
      accessibilityHint="Abre os detalhes do produto"
      activeOpacity={0.7}
      {...rest}
    >
      <Image
        source={data.thumbnail}
        className="w-20 h-20 rounded-md"
        accessible={false}
      />

      <View className="flex-1 ml-3">
        <Text
          className="text-soft font-subtitle text-base"
          numberOfLines={1}
        >
          {data.title}
        </Text>

        <Text
          className="text-muted font-body text-xs leading-5 mt-0.5"
          numberOfLines={2}
        >
          {data.description}
        </Text>

        <Text className="text-primary font-heading text-sm mt-1">{price}</Text>
      </View>
    </TouchableOpacity>
  );
});

ProductCard.displayName = "ProductCard";
