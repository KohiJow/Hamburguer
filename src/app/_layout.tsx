import { useEffect } from "react";
import { Slot } from "expo-router";
import type { ErrorBoundaryProps } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeWindStyleSheet } from "nativewind";

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { ErrorScreen } from "@/components/error-screen";
import { Loading } from "@/components/loading";

import { hydrateCart } from "@/stores/cart-store";

// No web o NativeWind 2 espera um CSS do Tailwind que este projeto nao gera
// (o bundler e o Metro), entao as classes nao viravam estilo nenhum. Com
// "native" ele usa os estilos compilados pelo babel em todas as plataformas.
NativeWindStyleSheet.setOutput({ default: "native" });

// O expo-router usa este export quando uma tela lanca erro em runtime.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <ErrorScreen error={error} retry={retry} />;
}

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    void hydrateCart();
  }, []);

  // Se a fonte falhar, segue com a fonte do sistema em vez de travar no spinner.
  if (!fontsLoaded && !fontError) {
    return <Loading message="Carregando fontes" />;
  }

  return (
    <SafeAreaView className="bg-background flex-1">
      <StatusBar style="light" />
      <Slot />
    </SafeAreaView>
  );
}
