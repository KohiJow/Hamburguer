import { Text, View } from "react-native";

import { Feather } from "@expo/vector-icons";

import { colors } from "@/theme";

import { Button } from "./button";

type ErrorScreenProps = {
  error: Error;
  retry: () => Promise<void>;
};

export function ErrorScreen({ error, retry }: ErrorScreenProps) {
  return (
    <View className="flex-1 bg-background items-center justify-center p-5 gap-2">
      <Feather name="alert-triangle" size={40} color={colors.danger} />

      <Text className="text-soft font-heading text-lg text-center mt-2">
        Algo deu errado
      </Text>

      <Text className="text-muted font-body text-sm text-center leading-5">
        {error.message}
      </Text>

      <View className="w-full mt-4">
        <Button onPress={() => void retry()}>
          <Button.Text>Tentar de novo</Button.Text>
        </Button>
      </View>
    </View>
  );
}
