import { defaultHeaderOptions } from "@/constants/navigation";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={defaultHeaderOptions}>
      <Stack.Screen name="login" options={{ headerTitle: "Login" }} />
      <Stack.Screen
        name="sign-up"
        options={{ headerTitle: "Criação de conta" }}
      />
      <Stack.Screen
        name="confirm-account-creation"
        options={{ headerTitle: "Confirmação de criação de conta" }}
      />
      <Stack.Screen
        name="account-created-message"
        options={{ headerTitle: "Conta criada com sucesso!" }}
      />
    </Stack>
  );
}
