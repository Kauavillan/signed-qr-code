import Button from "@/components/button";
import ControlledTextInput from "@/components/controlled-text-input";
import MultiStepForm, { MultiStepFormRef } from "@/components/multi-step-form";
import ScreenContainer from "@/components/screen-container";
import InputsContainer from "@/components/ui/inputs-container";
import {
  TokenOnlyData,
  tokenOnlySchema,
  UserData,
  userDataSchema,
} from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Text } from "react-native";

export default function Register() {
  const { email }: { email: string } = useLocalSearchParams();
  const multiStepFormRef = useRef<MultiStepFormRef>(null);
  const {
    control: tokenControl,
    handleSubmit: handleTokenSubmit,
    formState: { errors: tokenErrors },
  } = useForm<TokenOnlyData>({
    resolver: zodResolver(tokenOnlySchema),
  });

  const {
    control: userDataControl,
    handleSubmit: handleUserDataSubmit,
    formState: { errors: userDataErrors },
  } = useForm<UserData>({
    resolver: zodResolver(userDataSchema),
  });

  return (
    <ScreenContainer>
      <Text>Register Page</Text>
      <MultiStepForm ref={multiStepFormRef}>
        <InputsContainer>
          <ControlledTextInput
            control={tokenControl}
            name="token"
            placeholder="Insira o token recebido por e-mail"
            errors={tokenErrors}
            maxLength={4}
            keyboardType="numeric"
          />
          <Button
            text="Validar token"
            onPress={handleTokenSubmit(() =>
              multiStepFormRef.current?.nextStep()
            )}
          />
        </InputsContainer>
        <InputsContainer>
          <ControlledTextInput
            control={userDataControl}
            name="name"
            placeholder="Nome"
            errors={userDataErrors}
          />
          <ControlledTextInput
            control={userDataControl}
            name="password"
            placeholder="Senha"
            type="password"
            errors={userDataErrors}
          />
          <ControlledTextInput
            control={userDataControl}
            name="confirmPassword"
            placeholder="Confirme a senha"
            type="password"
            errors={userDataErrors}
          />
          <Button
            text="Criar conta"
            onPress={handleUserDataSubmit(() =>
              multiStepFormRef.current?.nextStep()
            )}
          />
        </InputsContainer>
      </MultiStepForm>
    </ScreenContainer>
  );
}
