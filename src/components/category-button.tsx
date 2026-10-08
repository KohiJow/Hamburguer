import { Text, Pressable, PressableProps } from "react-native";

import { clsx } from "clsx";

type CategoryProps = PressableProps & {
  title: string;
  isSelected?: boolean;
};

export function CategoryButton({ title, isSelected = false, ...rest }: CategoryProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
      className={clsx("bg-surface px-4 justify-center rounded-md h-11", {
        "bg-accent": isSelected,
      })}
      {...rest}
    >
      <Text
        className={clsx("text-soft font-subtitle text-sm", {
          "text-ink font-heading": isSelected,
        })}
      >
        {title}
      </Text>
    </Pressable>
  );
}
