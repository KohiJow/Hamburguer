import { Link } from "expo-router";

import type { ComponentProps } from "react";

type LinkButtonProps = ComponentProps<typeof Link> & {
  title: string;
};

export function LinkButton({ title, ...rest }: LinkButtonProps) {
  return (
    <Link
      className="text-link text-center text-base font-body py-3"
      accessibilityRole="link"
      {...rest}
    >
      {title}
    </Link>
  );
}
