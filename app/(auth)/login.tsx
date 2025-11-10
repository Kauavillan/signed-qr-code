import Button from "@/components/button";
import ControlledTextInput from "@/components/controlled-text-input";
import CustomPressable from "@/components/custom-pressable";
import ScreenContainer from "@/components/screen-container";
import InputsContainer from "@/components/ui/inputs-container";
import InputsFormContainer from "@/components/ui/inputs-form-container";
import { Colors } from "@/constants/theme";
import { loginFormSchema, type LoginFormData } from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  function onSubmit(data: LoginFormData) {
    console.log(data);
  }
  return (
    <ScreenContainer includeSafeArea>
      <InputsFormContainer>
        <Text>Login Page</Text>
        <CustomPressable onPress={() => router.push("/generate-codes")}>
          <View>
            <Text>Gerar qr code</Text>
          </View>
        </CustomPressable>
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
            name="password"
            placeholder="Senha"
            type="password"
            errors={formState.errors}
          />

          <Button onPress={handleSubmit(onSubmit)} text="Login" />
        </InputsContainer>
      </InputsFormContainer>
      <View>
        <Text style={{ textAlign: "center", marginTop: 16 }}>
          Não tem uma conta?{" "}
          <Text
            onPress={() => router.push("/sign-up")}
            style={{ color: Colors.primary }}
          >
            Crie uma agora!
          </Text>
        </Text>
      </View>
    </ScreenContainer>
  );
}
