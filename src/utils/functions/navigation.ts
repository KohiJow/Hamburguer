import { router } from "expo-router";

// Quem abre o carrinho por link direto (web) nao tem historico para voltar.
export function goBackOrHome(): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace("/");
}
