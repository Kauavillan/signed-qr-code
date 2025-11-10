import Button from "@/components/button";
import ControlledTextInput from "@/components/controlled-text-input";
import ScreenContainer from "@/components/screen-container";
import InputsContainer from "@/components/ui/inputs-container";
import InputsFormContainer from "@/components/ui/inputs-form-container";
import { Colors } from "@/constants/theme";
import { EmailOnlyData, emailOnlySchema } from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

export default function SignUp() {
  const router = useRouter();
  const multiStepRef = useRef(null);
  const { control, handleSubmit, formState } = useForm<EmailOnlyData>({
    resolver: zodResolver(emailOnlySchema),
  });

  function emailSubmitted(data: EmailOnlyData) {
    router.push({
      pathname: "/register",
      params: { email: data.email },
    });
  }

  return (
    <ScreenContainer>
      <InputsFormContainer>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          Criar Conta
        </Text>
        <InputsContainer>
          <Text>
            Vamos precisar de algumas informações para criar sua conta.{"\n\n"}
            Inicie com seu e-mail
          </Text>
          <ControlledTextInput
            control={control}
            type="email"
            name="email"
            placeholder="E-mail"
            errors={formState.errors}
          />

          <Button onPress={handleSubmit(emailSubmitted)} text="Criar conta" />
        </InputsContainer>
      </InputsFormContainer>
      <View>
        <Text style={{ textAlign: "center", marginTop: 16 }}>
          Já tem uma conta?{" "}
          <Text
            onPress={() => router.push("/login")}
            style={{ color: Colors.primary }}
          >
            Faça o login!
          </Text>
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formBackground: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "100%",
  },
});
