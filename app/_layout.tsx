import { defaultHeaderOptions } from "@/constants/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

function getMinutes(minutes: number): number {
  return 1000 * 60 * minutes;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: getMinutes(60),
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  useReactQueryDevTools(queryClient);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      // Definir fonte padrão global para <ThemedText />
      // Evita sobrescrever estilos existentes se já definidos
      const { Text } = require("react-native");
      if (Text.defaultProps == null) Text.defaultProps = {};
      Text.defaultProps.style = [
        Text.defaultProps.style,
        { fontFamily: "Inter_400Regular" },
      ];
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Mantém splash até fonte carregar
  }

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <AuthProvider>
          <Stack screenOptions={defaultHeaderOptions}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="issuer" options={{ headerShown: false }} />
            <Stack.Screen
              name="qr-codes"
              options={{ headerTitle: "QR Codes" }}
            />
            <Stack.Screen name="[qrCodeId]" options={{ headerShown: false }} />
            <Stack.Screen
              name="qr-code-info"
              options={{ headerTitle: "Informações do QR Code" }}
            />
          </Stack>
        </AuthProvider>
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
