# Hamburguer

App mobile de hamburgueria feito em React Native com Expo e TypeScript. O cardápio fica
num arquivo local, o carrinho é guardado no aparelho e o pedido sai como mensagem de
WhatsApp. Não existe backend.

## Fluxo do pedido

1. Na home, o cliente escolhe uma categoria e toca num produto. Cada item mostra foto,
   descrição e preço.
2. Na tela do produto, vê preço, descrição e ingredientes, e toca em "Adicionar ao pedido".
3. O ícone de sacola aparece no topo com a quantidade de itens (acima de 9 vira "9+").
   Tocando nele, vai ao carrinho.
4. No carrinho, cada item tem preço unitário, subtotal e um controle de mais e menos.
   Na última unidade o botão de menos vira lixeira e pede confirmação antes de remover.
5. O cliente informa o endereço de entrega e toca em "Enviar pedido". Se o endereço estiver
   vazio ou curto demais, o erro aparece embaixo do campo. Se o número da loja não estiver
   configurado, um aviso explica o que falta.
6. O app abre o WhatsApp com a lista de itens (com subtotais), o endereço e o total já
   escritos. Só depois que o WhatsApp abriu o carrinho é limpo; se não abrir, o carrinho
   continua salvo e um aviso explica.

## Telas

| Arquivo | O que faz |
| --- | --- |
| `src/app/_layout.tsx` | Carrega a fonte Inter (se falhar, segue com a fonte do sistema), dispara a leitura do carrinho salvo, envolve o app num `SafeAreaView` escuro e exporta o `ErrorBoundary` com botão de tentar de novo |
| `src/app/index.tsx` | Home: abas de categoria e `SectionList` do cardápio. Tocar numa categoria rola até a seção correspondente |
| `src/app/product/[id].tsx` | Detalhe do produto: capa, preço, descrição e ingredientes num scroll, com o botão fixo embaixo. Id desconhecido redireciona para a home |
| `src/app/cart.tsx` | Carrinho: mostra "carregando" até o storage responder, estado vazio com atalho para o cardápio, itens com stepper, total, endereço com erro inline e envio pelo WhatsApp |
| `src/app/+not-found.tsx` | Rota inexistente, com atalho para o cardápio |

O cardápio tem 7 produtos em 4 categorias (Lanche do dia, Promoções, Sobremesa, Bebidas) e
está escrito à mão em `src/utils/data/products.ts`, junto com as imagens em `src/assets/products`.

## Estrutura

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

## Lógica fora das telas

As telas só ligam eventos a funções puras, que são as que têm teste:

- `stores/helpers/cart-in-memory.ts`: `add` soma na quantidade quando o produto já está lá;
  `remove` tira uma unidade e descarta o item quando chega a zero. Nenhuma das duas altera a
  lista recebida.
- `utils/functions/cart-summary.ts`: `getCartQuantity`, `getCartTotal` e `getItemSubtotal`,
  com arredondamento para centavos.
- `utils/functions/order.ts`: `validateOrder` devolve `{ ok: true }` ou o campo com problema
  (`items`, `address` ou `storePhone`) e a mensagem; `buildOrderMessage` monta o texto do
  pedido; `buildWhatsAppUrl` codifica a mensagem na URL da API do WhatsApp;
  `isValidStorePhone` aceita só dígitos com código do país e DDD.
- `utils/functions/dialog.ts`: `showMessage` e `confirmAction` usam `Alert` no aparelho e
  `window.alert`/`window.confirm` no navegador, onde o `Alert` do react-native-web não faz nada.
- `utils/data/products.ts`: tipos `Product` e `MenuSection`, `MENU`, `PRODUCTS`, `CATEGORIES`
  e `findProductById`, que aceita o parâmetro de rota como string ou lista.

A store (`stores/cart-store.ts`) persiste só a lista de produtos no AsyncStorage (chave
`hamburguer:cart`). A leitura começa em `hydrateCart()`, chamada no layout raiz depois de
montar, e `useCartHydrated()` diz quando terminou (inclusive se o storage estiver corrompido,
caso em que o carrinho começa vazio e um aviso vai para o console).

## Tema

Cores e fontes ficam em `src/theme/tokens.json`. O `tailwind.config.js` lê esse arquivo para
gerar as classes (`bg-background`, `bg-surface`, `text-muted`, `text-primary`, `bg-accent`,
`text-danger`...) e `src/theme/index.ts` exporta os mesmos valores para o que precisa de cor
em JavaScript (ícones, placeholder, spinner). Todos os pares de texto e fundo usados ficam
acima de 4.5:1 de contraste; a aba selecionada usa texto escuro sobre laranja por isso.

## Acessibilidade e UI

- Todo alvo de toque tem pelo menos 44px: abas de categoria, botão do carrinho, stepper,
  botões e links.
- Botões, abas, links e cabeçalhos têm `accessibilityRole`; o carrinho anuncia a quantidade
  de itens, os cards anunciam nome e preço, e o stepper diz o que vai fazer ("Aumentar
  X-React", "Remover X-React do carrinho").
- O botão de enviar fica desabilitado e com spinner enquanto o WhatsApp está abrindo.
- Estados de carregando (fontes e carrinho), vazio (carrinho) e erro (tela de erro global,
  rota inexistente, endereço inválido).

## Stack

- Expo 54 e React Native 0.79, TypeScript em modo `strict` com `noUncheckedIndexedAccess`,
  `noUnusedLocals`, `noUnusedParameters` e `noImplicitReturns`
- `expo-router` 5 para navegação por arquivos, com `typedRoutes` ligado
- NativeWind 2 para estilizar com classes do Tailwind. No web o NativeWind usa os estilos
  compilados pelo babel (`NativeWindStyleSheet.setOutput({ default: "native" })`), e o
  `babel.config.js` liga o polyfill de `import.meta` do `babel-preset-expo` porque o build
  ESM do zustand usa essa sintaxe e quebrava o bundle do navegador
- Zustand com o middleware `persist` gravando o carrinho no AsyncStorage
- Fonte Inter via `@expo-google-fonts/inter`, ícones Feather do `@expo/vector-icons`
- Jest com o preset `jest-expo` nos testes, ESLint com `eslint-config-expo`

## Rodando

```bash
npm install
cp .env.example .env   # número de WhatsApp que recebe os pedidos
npx expo start
```

Abra pelo QR code no Expo Go ou rode num emulador Android ou iOS. `npm run web` abre no
navegador.

O número da loja vem de `EXPO_PUBLIC_STORE_PHONE` (código do país + DDD + número, só dígitos).
Sem essa variável, ou com ela em outro formato, o app avisa em vez de abrir o WhatsApp.

## Scripts

```bash
npm test             # jest, roda uma vez
npm run test:watch
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run check        # typecheck, lint e testes em sequência
```

O workflow em `.github/workflows/ci.yml` roda `check` a cada push e pull request.

## Testes

São 50 testes unitários, sem snapshot:

- `cart-in-memory`: somar quantidade, não duplicar produto, remover unidade, remover item,
  só mexer no produto informado, id inexistente, não mutar a lista recebida
- `cart-summary`: quantidade, total, subtotal e arredondamento
- `order`: telefone da loja, endereço mínimo, ordem das validações, texto do pedido e
  codificação da URL (ida e volta)
- `dialog`: o `confirmAction` resolve `true` no confirmar e `false` no cancelar ou fechar
- `products`: ids únicos, seções e categorias coerentes, preço e imagens presentes,
  `findProductById` com string, lista e id desconhecido
- `cart-store`: hidratação, add/remove/clear, o que vai para o AsyncStorage, carrinho salvo
  recuperado na próxima abertura e storage corrompido sem travar o app
- `formatCurrency` e os rótulos do badge e do stepper

## Observações

`npx expo-doctor` aponta que `react-native`, `expo-router` e outros pacotes estão nas versões
do SDK 53 enquanto o `expo` é o 54. Tudo compila, testa e roda no web assim, mas alinhar as
versões pede teste em aparelho e ficou fora deste trabalho.

## Origem

O layout saiu de um projeto de aula, e o campo `author` do `package.json` guarda o
crédito original. O que mudou depois disso está no histórico: correção do envio do
pedido pelo WhatsApp, número da loja fora do código, lógica separada em funções puras
com testes, componentes com acessibilidade, tema único e lint.
