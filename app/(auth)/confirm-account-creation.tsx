import Button from "@/components/button";
import Icon from "@/components/icons";
import ScreenContainer from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import InputsFormContainer from "@/components/ui/inputs-form-container";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function ConfirmAccountCreation() {
  const router = useRouter();
  return (
    <ScreenContainer style={{ justifyContent: "center", alignItems: "center" }}>
      <InputsFormContainer
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            padding: 10,
            borderRadius: 100,
            backgroundColor: Colors.green,
            marginBottom: 20,
          }}
        >
          <Icon
            provider="Feather"
            name="check-circle"
            size={74}
            color="white"
          />
        </View>

        <ThemedText style={{ textAlign: "center" }} type="title">
          Sua conta foi criada com sucesso!
        </ThemedText>
        <ThemedText style={{ textAlign: "center", marginTop: 30 }}>
          Você irá receber um e-mail para confirmar a criação da sua conta.
          Verifique-a e faça o login para começar a criar seus QR Codes seguros.
        </ThemedText>
        <View>
          <Button
            text="Já verifiquei a conta. Ir para login"
            onPress={() => router.replace("/login")}
            style={{ marginTop: 60, paddingHorizontal: 20, width: "100%" }}
          />
        </View>
      </InputsFormContainer>
    </ScreenContainer>
  );
}
