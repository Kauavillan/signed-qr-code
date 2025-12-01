import Button from "@/components/button";
import ControlledTextInput from "@/components/controlled-text-input";
import ScreenContainer from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import InputsContainer from "@/components/ui/inputs-container";
import InputsFormContainer from "@/components/ui/inputs-form-container";
import Logo from "@/components/ui/logo";
import sizes from "@/constants/sizes";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useUserLoginMutation } from "@/hooks/api/users/mutations";
import { loginFormSchema, type LoginFormData } from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function Login() {
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const { loginWithTokens, userId } = useAuth();

  useEffect(() => {
    if (userId) router.replace("/issuer/qr-codes");
  }, [userId]);

  const { mutateAsync: login, isPending } = useUserLoginMutation({
    onError: (e) => Alert.alert("Erro ao fazer login", e.message),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      console.log("Submitting login with data:", data);
      const token = await login(data);
      await loginWithTokens(token.token);
      router.push("/issuer/qr-codes");
    } catch (e: any) {
      console.log("Login error", e);
    }
  }

  return (
    <ScreenContainer includeSafeArea>
      <KeyboardAwareScrollView
        bottomOffset={50}
        showsVerticalScrollIndicator={false}
      >
        <InputsFormContainer>
          <Logo size={150} />
          <View>
            <ThemedText
              style={{ fontSize: 24, fontWeight: "bold", marginVertical: 16 }}
            >
              Login
            </ThemedText>

            <InputsContainer>
              <ControlledTextInput
                control={control}
                name="identifier"
                type="email"
                autoCapitalize="none"
                placeholder="E-mail ou username"
                errors={formState.errors}
              />
              <ControlledTextInput
                control={control}
                name="password"
                placeholder="Senha"
                type="password"
                errors={formState.errors}
              />

              <Button
                onPress={handleSubmit(onSubmit)}
                text="Login"
                isLoading={isPending}
              />
            </InputsContainer>
          </View>
        </InputsFormContainer>
      </KeyboardAwareScrollView>
      <View style={{ paddingVertical: sizes.vh.get(5) }}>
        <ThemedText style={{ textAlign: "center", marginTop: 16 }}>
          Não tem uma conta?{" "}
          <ThemedText
            onPress={() => router.push("/sign-up")}
            style={{ color: Colors.primary }}
          >
            Crie uma agora!
          </ThemedText>
        </ThemedText>
      </View>
    </ScreenContainer>
  );
}
