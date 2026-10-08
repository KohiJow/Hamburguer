import { Text, TextInput, TextInputProps, View } from "react-native";

import { clsx } from "clsx";

import { colors } from "@/theme";

type InputProps = TextInputProps & {
  label: string;
  errorMessage?: string;
};

export function Input({ label, errorMessage, ...rest }: InputProps) {
  const hasError = Boolean(errorMessage);

  return (
    <View className="gap-2">
      <Text className="text-soft font-subtitle text-sm">{label}</Text>

      <TextInput
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.muted}
        accessibilityLabel={label}
        className={clsx(
          "h-32 bg-surface rounded-md px-4 py-3 font-body text-sm text-foreground border",
          hasError ? "border-danger" : "border-surface"
        )}
        {...rest}
      />

      {hasError && (
        <Text
          className="text-danger font-body text-sm"
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}
