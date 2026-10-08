import { ActivityIndicator, Text, View } from "react-native";

import { colors } from "@/theme";

type LoadingProps = {
  message?: string;
};

export function Loading({ message = "Carregando" }: LoadingProps) {
  return (
    <View
      className="flex-1 items-center justify-center bg-background gap-3"
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator color={colors.foreground} />
      <Text className="text-muted font-body text-sm">{message}</Text>
    </View>
  );
}
