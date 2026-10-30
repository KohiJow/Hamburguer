# Hamburguer
English | [Português](README.pt-BR.md)

Mobile app for a burger shop, built in React Native with Expo and TypeScript. The menu lives in
a local file, the cart is stored on the device and the order goes out as a WhatsApp message.
There is no backend.

## Order flow

1. On the home screen, the customer picks a category and taps a product. Each item shows a
   photo, description and price.
2. On the product screen, they see the price, description and ingredients, and tap
   "Adicionar ao pedido" (Add to order).
3. The bag icon appears at the top with the number of items (above 9 it shows "9+").
   Tapping it opens the cart.
4. In the cart, each item has its unit price, subtotal and a plus and minus control.
   On the last unit, the minus button becomes a trash can and asks for confirmation before
   removing the item.
5. The customer enters the delivery address and taps "Enviar pedido" (Send order). If the
   address is empty or too short, the error appears below the field. If the store's number is
   not configured, a notice explains what is missing.
6. The app opens WhatsApp with the list of items (with subtotals), the address and the total
   already written. The cart is cleared only after WhatsApp has opened; if it does not open,
   the cart stays saved and a notice explains why.

## Screens

| File | What it does |
| --- | --- |
| `src/app/_layout.tsx` | Loads the Inter font (if that fails, it carries on with the system font), starts reading the saved cart, wraps the app in a dark `SafeAreaView` and exports the `ErrorBoundary` with a try-again button |
| `src/app/index.tsx` | Home: category tabs and the menu `SectionList`. Tapping a category scrolls to the matching section |
| `src/app/product/[id].tsx` | Product detail: cover image, price, description and ingredients in a scroll view, with the button fixed at the bottom. An unknown id redirects to the home screen |
| `src/app/cart.tsx` | Cart: shows "carregando" (loading) until the storage responds, an empty state with a shortcut to the menu, items with a stepper, the total, the address with an inline error, and sending through WhatsApp |
| `src/app/+not-found.tsx` | Unknown route, with a shortcut to the menu |

The menu has 7 products in 4 categories: Lanche do dia (sandwich of the day), Promoções
(deals), Sobremesa (dessert) and Bebidas (drinks). It is written by hand in
`src/utils/data/products.ts`, with its images in `src/assets/products`.

## Structure

```
src/
  app/              telas (expo-router)
  components/       componentes reutilizáveis (botão, input, header, card, stepper, estados)
  stores/           store do carrinho (zustand + persist) e a lógica pura em helpers/
  theme/            tokens de cor e fonte usados pelo tailwind e pelo código
  utils/data/       cardápio tipado e busca por id
  utils/functions/  funções puras: total, validação e mensagem do pedido, moeda, diálogos
  test-utils/       fábricas de produto para os testes
```

## Logic outside the screens

The screens only connect events to pure functions, and those are the ones with tests:

- `stores/helpers/cart-in-memory.ts`: `add` increases the quantity when the product is already
  in the cart; `remove` takes away one unit and drops the item when it reaches zero. Neither of
  them changes the list it receives.
- `utils/functions/cart-summary.ts`: `getCartQuantity`, `getCartTotal` and `getItemSubtotal`,
  rounded to cents.
- `utils/functions/order.ts`: `validateOrder` returns `{ ok: true }` or the field with the
  problem (`items`, `address` or `storePhone`) and the message; `buildOrderMessage` builds the
  order text; `buildWhatsAppUrl` encodes the message into the WhatsApp API URL;
  `isValidStorePhone` accepts only digits, with the country code and the DDD (Brazilian area
  code).
- `utils/functions/dialog.ts`: `showMessage` and `confirmAction` use `Alert` on the device and
  `window.alert`/`window.confirm` in the browser, where react-native-web's `Alert` does nothing.
- `utils/data/products.ts`: the `Product` and `MenuSection` types, `MENU`, `PRODUCTS`,
  `CATEGORIES` and `findProductById`, which accepts the route parameter as a string or a list.

The store (`stores/cart-store.ts`) persists only the product list in AsyncStorage (key
`hamburguer:cart`). Reading starts in `hydrateCart()`, called in the root layout after it
mounts, and `useCartHydrated()` tells when it has finished (even if the storage is corrupted,
in which case the cart starts empty and a warning goes to the console).

## Theme

Colors and fonts live in `src/theme/tokens.json`. `tailwind.config.js` reads that file to
generate the classes (`bg-background`, `bg-surface`, `text-muted`, `text-primary`, `bg-accent`,
`text-danger`...) and `src/theme/index.ts` exports the same values for whatever needs a color
in JavaScript (icons, placeholder, spinner). Every text and background pair in use stays above
a 4.5:1 contrast ratio; that is why the selected tab uses dark text on orange.

## Accessibility and UI

- Every touch target is at least 44px: category tabs, the cart button, the stepper, buttons
  and links.
- Buttons, tabs, links and headers have `accessibilityRole`; the cart announces the number of
  items, the cards announce name and price, and the stepper says what it is about to do, for
  example "Aumentar X-React" (Increase X-React) and "Remover X-React do carrinho" (Remove
  X-React from the cart).
- State (selected tab, disabled or busy button) goes through `aria-selected`,
  `aria-disabled` and `aria-busy`, which work both on the device and in the browser.
  `accessibilityState` is ignored by react-native-web 0.20, and the selected tab was not
  announced on the web. The icon inside the button gets `aria-hidden`, because the text already
  says what the button does.
- The send button stays disabled and shows a spinner while WhatsApp is opening.
- Loading states (fonts and cart), an empty state (cart) and error states (global error screen,
  unknown route, invalid address).

## Stack

- Expo 54 and React Native 0.79, TypeScript in `strict` mode with `noUncheckedIndexedAccess`,
  `noUnusedLocals`, `noUnusedParameters` and `noImplicitReturns`
- `expo-router` 5 for file-based navigation, with `typedRoutes` turned on
- NativeWind 2 for styling with Tailwind classes. On the web, NativeWind uses the styles
  compiled by babel (`NativeWindStyleSheet.setOutput({ default: "native" })`), and
  `babel.config.js` turns on the `import.meta` polyfill from `babel-preset-expo`, because
  zustand's ESM build uses that syntax and was breaking the browser bundle. NativeWind 2's
  `gap` is emulated with margins (negative on the parent, positive on the children), which
  misaligns a `w-full` child inside `items-center`; that is why `EmptyState` and `ErrorScreen`
  use explicit margins and `self-stretch`
- Zustand with the `persist` middleware saving the cart to AsyncStorage
- Inter font via `@expo-google-fonts/inter`, Feather icons from `@expo/vector-icons`
- Jest with the `jest-expo` preset for the tests, ESLint with `eslint-config-expo`

## Running

```bash
npm install
cp .env.example .env   # número de WhatsApp que recebe os pedidos
npx expo start
```

Open it through the QR code in Expo Go or run it on an Android or iOS emulator. `npm run web`
opens it in the browser.

The store's number comes from `EXPO_PUBLIC_STORE_PHONE` (country code + DDD + number, digits
only). Without this variable, or with it in another format, the app shows a warning instead of
opening WhatsApp. With `expo start` it is read at runtime; with `npx expo export` the value is
embedded in the bundle and the Metro cache does not change when the variable changes, so export
with `--clear` after changing it.

## Scripts

```bash
npm test             # jest, roda uma vez
npm run test:watch
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run check        # typecheck, lint e testes em sequência
```

The workflow in `.github/workflows/ci.yml` runs `check` on every push and pull request.

## Tests

There are 50 unit tests, with no snapshots:

- `cart-in-memory`: adding to the quantity, not duplicating a product, removing a unit,
  removing an item, only touching the given product, unknown id, not mutating the list it
  receives
- `cart-summary`: quantity, total, subtotal and rounding
- `order`: store phone, minimum address length, sequence of the validations, order text and
  URL encoding (round trip)
- `dialog`: `confirmAction` resolves `true` on confirm and `false` on cancel or close
- `products`: unique ids, consistent sections and categories, price and images present,
  `findProductById` with a string, a list and an unknown id
- `cart-store`: hydration, add/remove/clear, what goes into AsyncStorage, the saved cart
  restored the next time the app opens, and corrupted storage without freezing the app
- `formatCurrency` and the badge and stepper labels

## Notes

`npx expo-doctor` reports that `react-native`, `expo-router` and other packages are on the
SDK 53 versions while `expo` is on 54. As things are, everything compiles, gets tested and runs
on the web, but aligning the versions requires testing on a device and was left out of this
work.

## Origin

The layout came from a class project, and the `author` field in `package.json` keeps the
original credit. What changed after that is in the history: a fix for sending the order through
WhatsApp, the store's number moved out of the code, logic split into pure functions with tests,
accessible components, a single theme, and linting.
