import { defaultHeaderOptions } from "@/constants/navigation";
import { Stack } from "expo-router";

export default function QrCodeActionsLayout() {
  return (
    <Stack screenOptions={defaultHeaderOptions}>
      <Stack.Screen
        name="report"
        options={{ headerTitle: "Denunciar QR Code" }}
      />
      <Stack.Screen
        name="report-completed"
        options={{ headerTitle: "Denúncia Finalizada" }}
      />
    </Stack>
  );
}
