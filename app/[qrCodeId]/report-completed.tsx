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
            backgroundColor: Colors.error,
            marginBottom: 20,
          }}
        >
          <Icon
            provider="MaterialIcons"
            name="report"
            size={74}
            color="white"
          />
        </View>

        <ThemedText style={{ textAlign: "center" }} type="title">
          Denúncia enviada com sucesso!
        </ThemedText>
        <ThemedText style={{ textAlign: "center", marginTop: 30 }}>
          Obrigado por ajudar a manter a comunidade segura. Analisaremos a
          denúncia o mais breve possível.
        </ThemedText>
        <View>
          <Button
            text="Voltar para o leitor"
            onPress={() => router.replace("/")}
            style={{ marginTop: 60, paddingHorizontal: 20, width: "100%" }}
          />
        </View>
      </InputsFormContainer>
    </ScreenContainer>
  );
}
