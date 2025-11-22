import { Stack } from "expo-router";

export default function QRCodesPagesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerTitle: "Lista de QR Codes" }}
      />
      <Stack.Screen
        name="generate-code"
        options={{ headerTitle: "Criar QR Code" }}
      />
    </Stack>
  );
}
