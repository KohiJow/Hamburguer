import type { ComponentProps, ReactNode } from "react";
import { Text, View } from "react-native";

import { Feather } from "@expo/vector-icons";

import { colors } from "@/theme";

type EmptyStateProps = {
  icon: ComponentProps<typeof Feather>["name"];
  title: string;
  description?: string;
  children?: ReactNode;
};

export function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-5 py-12 gap-2">
      <Feather name={icon} size={40} color={colors.muted} />

      <Text className="text-soft font-heading text-lg text-center mt-2">
        {title}
      </Text>

      {description && (
        <Text className="text-muted font-body text-sm text-center leading-5">
          {description}
        </Text>
      )}

      {children && <View className="w-full mt-4 gap-3">{children}</View>}
    </View>
  );
}
