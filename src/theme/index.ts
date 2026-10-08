import tokens from "./tokens.json";

// Mesma fonte de verdade do tailwind.config.js: as classes (bg-surface,
// text-muted...) e os valores usados em JS (icones, placeholder) batem.
export const theme = tokens;

export type ThemeColor = keyof typeof tokens.colors;

export const colors = tokens.colors;

export const fonts = tokens.fonts;
