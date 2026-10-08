import { forwardRef } from "react";

import {
  TouchableOpacity,
  TouchableOpacityProps,
  ImageSourcePropType,
  Image,
  View,
  Text,
} from "react-native";

type ProductCardData = {
  title: string;
  description: string;
  thumbnail: ImageSourcePropType;
  quantity?: number;
};

type ProductCardProps = TouchableOpacityProps & {
  data: ProductCardData;
};

export const ProductCard = forwardRef<
  React.ComponentRef<typeof TouchableOpacity>,
  ProductCardProps
>(({ data, ...rest }, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      className="w-full flex-row items-center pb-4"
      {...rest}
    >
      <Image source={data.thumbnail} className="w-20 h-20 rounded-md" />

      <View className="flex-1 ml-3">
        <View className="flex-row items-center">
          <Text className="text-slate-100 font-subtitle text-base flex-1">
            {data.title}
          </Text>

          {!!data.quantity && (
            <Text className="text-slate-400 font-subtitle text-sm">
              x {data.quantity}
            </Text>
          )}
        </View>

        <Text className="text-slate-400 text-xs leading-5 mt-0.5">
          {data.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

ProductCard.displayName = "ProductCard";
