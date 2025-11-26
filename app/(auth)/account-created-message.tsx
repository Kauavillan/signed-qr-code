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
          Sua conta foi verificada com sucesso!
        </ThemedText>
        <ThemedText style={{ textAlign: "center", marginTop: 30 }}>
          A verificação do seu e-mail foi concluída. Agora você pode fazer o
          login e começar a criar seus QR Codes seguros.
        </ThemedText>
        <View>
          <Button
            text="Ir para login"
            onPress={() => router.replace("/login")}
            style={{ marginTop: 60, paddingHorizontal: 20, width: "100%" }}
          />
        </View>
      </InputsFormContainer>
    </ScreenContainer>
  );
}
