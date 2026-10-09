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

// O icone e decorativo (o titulo ja diz o que houve), por isso aria-hidden.
// Espacamento com margens, nao com gap: o NativeWind 2 simula gap com
// margens negativas no pai e positivas nos filhos, e junto com items-center
// o botao saia das margens da tela.
export function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-5 py-12">
      <Feather name={icon} size={40} color={colors.muted} aria-hidden />

      <Text className="text-soft font-heading text-lg text-center mt-4">
        {title}
      </Text>

      {description && (
        <Text className="text-muted font-body text-sm text-center leading-5 mt-2">
          {description}
        </Text>
      )}

      {children && <View className="self-stretch mt-6">{children}</View>}
    </View>
  );
}
