import { forwardRef, ReactNode } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
} from "react-native";

import { clsx } from "clsx";

import { colors } from "@/theme";

type ButtonProps = TouchableOpacityProps & {
  children: ReactNode;
  isLoading?: boolean;
};

type ButtonTextProps = {
  children: ReactNode;
};

type ButtonIconProps = {
  children: ReactNode;
};

// forwardRef para o Link asChild do expo-router conseguir envolver o botao.
const ButtonRoot = forwardRef<
  React.ComponentRef<typeof TouchableOpacity>,
  ButtonProps
>(({ children, isLoading = false, disabled, accessibilityState, ...rest }, ref) => {
  const isDisabled = Boolean(disabled) || isLoading;

  return (
    <TouchableOpacity
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{
        ...accessibilityState,
        disabled: isDisabled,
        busy: isLoading,
      }}
      disabled={isDisabled}
      className={clsx(
        "h-12 px-4 bg-primary rounded-md items-center justify-center flex-row",
        { "opacity-60": isDisabled }
      )}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? <ActivityIndicator color={colors.ink} /> : children}
    </TouchableOpacity>
  );
});

ButtonRoot.displayName = "Button";

function ButtonText({ children }: ButtonTextProps) {
  return (
    <Text className="text-ink font-heading text-base mx-2">{children}</Text>
  );
}

function ButtonIcon({ children }: ButtonIconProps) {
  return children;
}

const Button = Object.assign(ButtonRoot, {
  Text: ButtonText,
  Icon: ButtonIcon,
});

export { Button };
