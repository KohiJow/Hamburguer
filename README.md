# Hamburguer

App mobile de hamburgueria feito em React Native com Expo e TypeScript. O cardápio fica
num arquivo local, o carrinho é guardado no aparelho e o pedido sai como mensagem de
WhatsApp. Não existe backend.

## Fluxo do pedido

1. Na home, o cliente escolhe uma categoria e toca num produto.
2. Na tela do produto, vê preço, descrição e ingredientes, e toca em "Adicionar ao pedido".
3. O ícone de sacola aparece no topo com a quantidade de itens. Tocando nele, vai ao carrinho.
4. No carrinho, informa o endereço de entrega e toca em "Enviar pedido". O app abre o
   WhatsApp com a lista de itens, o endereço e o total já escritos, limpa o carrinho e volta.

## Telas

| Arquivo | O que faz |
| --- | --- |
| `src/app/_layout.tsx` | Carrega a fonte Inter, mostra um spinner até terminar e envolve o app num `SafeAreaView` escuro |
| `src/app/index.tsx` | Home: lista horizontal de categorias e `SectionList` do cardápio. Tocar numa categoria rola até a seção correspondente |
| `src/app/product/[id].tsx` | Detalhe do produto: capa, preço em reais, descrição e ingredientes. Se o id não existir no cardápio, redireciona para a home |
| `src/app/cart.tsx` | Carrinho: itens com quantidade, total, campo de endereço e envio pelo WhatsApp. Tocar num item pergunta se quer remover |

O cardápio tem 7 produtos em 4 categorias (Lanche do dia, Promoções, Sobremesa, Bebidas) e
está escrito à mão em `src/utils/data/products.ts`, junto com as imagens em `src/assets/products`.

## Stack

- Expo 54 e React Native 0.79, TypeScript em modo `strict`
- `expo-router` 5 para navegação por arquivos, com `typedRoutes` ligado
- NativeWind 2 para estilizar com classes do Tailwind
- Zustand com o middleware `persist` gravando o carrinho no AsyncStorage (chave `hamburguer:cart`)
- Fonte Inter via `@expo-google-fonts/inter`, ícones Feather do `@expo/vector-icons`
- Jest com o preset `jest-expo` nos testes unitários

A lógica de carrinho fica separada da store em `src/stores/helpers/cart-in-memory.ts`: duas
funções puras, `add` e `remove`, que recebem a lista e devolvem uma nova. `add` soma na
quantidade quando o produto já está lá, `remove` tira uma unidade e descarta o item quando
chega a zero.

## Rodando

```bash
npm install
cp .env.example .env   # número de WhatsApp que recebe os pedidos
npx expo start
```

Abra pelo QR code no Expo Go ou rode num emulador Android ou iOS.

O número da loja vem de `EXPO_PUBLIC_STORE_PHONE` (formato internacional, só dígitos).
Sem essa variável, o app avisa em vez de abrir o WhatsApp.

## Testes

```bash
npm test          # roda uma vez
npm run test:watch
```

São 10 testes cobrindo `cart-in-memory` (somar quantidade, não duplicar produto, remover
unidade, remover item, id inexistente, não mutar a lista recebida) e `formatCurrency`.

## Origem

O layout saiu de um projeto de aula, e o campo `author` do `package.json` guarda o
crédito original. O que mudou depois disso está no histórico: correção do envio do
pedido pelo WhatsApp, número da loja fora do código e os testes de `cart-in-memory`
e `formatCurrency`.
