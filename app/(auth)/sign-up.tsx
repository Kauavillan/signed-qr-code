import Button from "@/components/button";
import ControlledTextInput from "@/components/controlled-text-input";
import ScreenContainer from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import InputsContainer from "@/components/ui/inputs-container";
import InputsFormContainer from "@/components/ui/inputs-form-container";
import { Colors } from "@/constants/theme";
import { useCreateUserMutation } from "@/hooks/api/users/mutations";
import { SignUpFormData, signUpFormSchema } from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";

export default function SignUp() {
  const router = useRouter();

  const { control, handleSubmit, formState } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
  });

  const { mutateAsync: createUser, isPending } = useCreateUserMutation({
    onSuccess() {
      router.replace("/confirm-account-creation");
    },
    onError: console.error,
  });

  function dataSubmitted(data: SignUpFormData) {
    const { confirmPassword, ...dataToSubmit } = data;
    createUser(dataToSubmit);
  }

  return (
    <ScreenContainer>
      <InputsFormContainer>
        <ThemedText
          style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}
        >
          Criar Conta
        </ThemedText>
        <InputsContainer>
          <ControlledTextInput
            control={control}
            type="email"
            name="email"
            placeholder="E-mail"
            errors={formState.errors}
          />
          <ControlledTextInput
            control={control}
            name="username"
            placeholder="Nome de usuário"
            errors={formState.errors}
          />
          <ThemedText type="small">O nome deve ser único</ThemedText>
          <ControlledTextInput
            control={control}
            type="password"
            name="password"
            placeholder="Senha"
            errors={formState.errors}
          />
          <ControlledTextInput
            control={control}
            type="password"
            name="confirmPassword"
            placeholder="Confirmação de senha"
            errors={formState.errors}
          />

          <Button
            onPress={handleSubmit(dataSubmitted)}
            text="Criar conta"
            isLoading={isPending}
          />
        </InputsContainer>
      </InputsFormContainer>
      <View>
        <ThemedText style={{ textAlign: "center", marginTop: 16 }}>
          Já tem uma conta?{" "}
          <ThemedText
            onPress={() => router.push("/login")}
            style={{ color: Colors.primary }}
          >
            Faça o login!
          </ThemedText>
        </ThemedText>
      </View>
    </ScreenContainer>
  );
}
