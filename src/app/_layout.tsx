import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeWindStyleSheet } from "nativewind";

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { Loading } from "@/components/loading";

// No web o NativeWind 2 espera um CSS do Tailwind que este projeto nao gera
// (o bundler e o Metro), entao as classes nao viravam estilo nenhum. Com
// "native" ele usa os estilos compilados pelo babel em todas as plataformas.
NativeWindStyleSheet.setOutput({ default: "native" });

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="bg-slate-900 flex-1">
      <Slot />
    </SafeAreaView>
  );
}
