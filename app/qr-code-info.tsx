import Button from "@/components/button";
import CustomPressable from "@/components/custom-pressable";
import Icon, { IconProps } from "@/components/icons";
import ScreenContainer from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import Logo from "@/components/ui/logo";
import sizes from "@/constants/sizes";
import { Colors } from "@/constants/theme";
import { useCheckIfDeviceCanComplaint } from "@/hooks/api/complaints/queries";
import { useValidateQrCode } from "@/hooks/api/qr-codes/mutations";
import { QueryError } from "@/services/query-handler";
import { opacify } from "@/utils/color";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking, ScrollView, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QrCodeInfo() {
  const [shouldValidateCode, setShouldValidateCode] = useState({
    isPending: true,
    shouldValidate: false,
  });
  const [codeSecurity, setCodeSecurity] = useState<
    "secure" | "warn" | "cant-validate" | "insecure" | undefined
  >(undefined);
  const { codeData }: { codeData: string } = useLocalSearchParams();
  const {
    mutateAsync: validateQrCode,
    isPending: isValidationPending,
    data,
    error,
  } = useValidateQrCode({
    onSuccess: (data) => console.log("Validation success:", data),
  });

  const { data: canComplaintData } = useCheckIfDeviceCanComplaint(data?.id);
  console.log("Can complaint data:", canComplaintData);
  const router = useRouter();
  useEffect(() => {
    if (codeData) {
      if (codeData.startsWith("QRypt."))
        setShouldValidateCode({ isPending: false, shouldValidate: true });
      else setShouldValidateCode({ isPending: false, shouldValidate: false });
    }
  }, [codeData]);

  function handleQrCodeContentPress() {
    const content = data?.content ?? codeData;
    if (!content) return;
    const trimmed = content.trim();

    // URL externa
    if (/^https?:\/\//i.test(trimmed)) {
      Linking.openURL(trimmed).catch(() => {
        Alert.alert("Erro", "Não foi possível abrir o link.");
      });
      return;
    }

    // Email
    if (/^mailto:/i.test(trimmed)) {
      Linking.openURL(trimmed).catch(() => {
        Alert.alert("Erro", "Não foi possível abrir o e-mail.");
      });
      return;
    }

    // Telefone
    if (/^tel:/i.test(trimmed)) {
      Linking.openURL(trimmed).catch(() => {
        Alert.alert("Erro", "Não foi possível abrir o telefone.");
      });
      return;
    }

    // Deep link interno do app: qrypt://rota/subrota
    if (/^qrypt:\/\//i.test(trimmed)) {
      try {
        const path = trimmed.replace(/^qrypt:\/\//i, "");
        if (path) router.push(`/${path}` as any);
        else Alert.alert("Conteúdo inválido", content);
      } catch (e) {
        Alert.alert("Erro", "Não foi possível navegar internamente.");
      }
      return;
    }

    // Fallback: apenas mostrar o conteúdo em um alerta
    Alert.alert("Conteúdo do QR", content);
  }

  // Dispara a validação quando apropriado
  useEffect(() => {
    if (!shouldValidateCode.isPending) {
      if (shouldValidateCode.shouldValidate) validateQrCode(codeData);
      else setCodeSecurity("cant-validate");
    }
  }, [shouldValidateCode.shouldValidate, shouldValidateCode.isPending]);

  // Classifica o resultado ou erro da validação
  useEffect(() => {
    if (data) {
      // complaintsCount determina segurança
      const complaintsCount: number = (data as any).complaintsCount ?? 0;
      console.log("Complaints count:", complaintsCount);
      if (complaintsCount === 0) setCodeSecurity("secure");
      else if (complaintsCount > 0 && complaintsCount < 3)
        setCodeSecurity("warn");
      else setCodeSecurity("insecure"); // limite >=3 não chega, mas fallback
      return;
    }
    if (error) {
      if (error instanceof QueryError) {
        const msg = error.message;
        const insecureMessages = [
          "Texto de QR code inválido.",
          "Falha ao decodificar texto do QR code.",
          "Nome de usuário do payload não pertence a nenhum usuário.",
          "Assinatura do QR code inválida.",
          "QR code inválido devido a reclamações.",
        ];
        if (error.status === 500) {
          setCodeSecurity("cant-validate");
        } else if (insecureMessages.includes(msg)) {
          setCodeSecurity("insecure");
        } else {
          setCodeSecurity("cant-validate");
        }
      } else {
        setCodeSecurity("cant-validate");
      }
    }
  }, [data, error]);
  let codeValidationParams: null | {
    icon: IconProps;
    color: string;
    text: string;
  } = null;
  switch (codeSecurity) {
    case "secure":
      codeValidationParams = {
        icon: { name: "check-circle", provider: "AntDesign" },
        color: Colors.green,
        text: "O código foi validado e não possui denúncias.",
      };
      break;
    case "warn":
      codeValidationParams = {
        icon: {
          name: "sign-caution",
          provider: "MaterialCommunityIcons",
          color: "#000",
        },
        color: Colors.yellow,
        text: "O código é válido, mas já foi denunciado. Recomendamos verificar o conteúdo com atenção.",
      };
      break;
    case "insecure":
      codeValidationParams = {
        icon: {
          name: "alert-circle",
          provider: "MaterialCommunityIcons",
        },
        color: Colors.error,
        text: "O código é inválido ou recebeu muitas denúncias. Por isso, não mostraremos o conteúdo dele.",
      };
      break;
    case "cant-validate":
      codeValidationParams = {
        icon: {
          name: "sign-caution",
          provider: "MaterialCommunityIcons",
          color: "#000",
        },
        color: Colors.yellow,
        text: "O código não foi gerado pelo aplicativo. Recomendamos verificar o conteúdo com atenção.",
      };
      break;
  }
  return (
    <ScreenContainer style={{ paddingTop: 0, paddingBottom: 0 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          padding: 20,
          paddingBottom: 40,
        }}
      >
        <Logo size={80} style={{ marginBottom: 60 }} />
        <View style={{ alignItems: "center", gap: 16 }}>
          {codeValidationParams && (
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                alignItems: "center",
                gap: 16,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 5,
              }}
            >
              <View
                style={{
                  backgroundColor: opacify(codeValidationParams.color, 0.8),
                  padding: 10,
                  borderRadius: 100,
                }}
              >
                <Icon
                  color={"#fff"}
                  {...codeValidationParams?.icon}
                  size={65}
                />
              </View>
              <ThemedText style={{ textAlign: "center" }}>
                {codeValidationParams?.text}
              </ThemedText>
            </View>
          )}
        </View>

        {codeData && (
          <View style={{ marginVertical: 16 }}>
            <QRCode
              value={codeData}
              size={sizes.vw.globalViewWidth * 0.8}
              backgroundColor={Colors.background}
            />
          </View>
        )}
        {(!shouldValidateCode.isPending &&
          !shouldValidateCode.shouldValidate) ||
        data?.content ? (
          <CustomPressable
            onPress={handleQrCodeContentPress}
            style={{
              borderWidth: 1,
              borderColor: Colors.primary,
              borderRadius: 8,
              padding: 12,
              marginTop: 20,
              width: "100%",
            }}
          >
            <View style={{ alignItems: "center", gap: 8 }}>
              <ThemedText
                style={{
                  color: Colors.primary,
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                Conteúdo
              </ThemedText>
              <ThemedText>{data?.content ?? codeData}</ThemedText>
              <ThemedText style={{ fontSize: 12, color: Colors.secondary }}>
                Clique aqui para ser redirecionado para o conteúdo
              </ThemedText>
            </View>
          </CustomPressable>
        ) : null}
        {data?.username && <ThemedText>Emissor: {data.username}</ThemedText>}
        {data?.createdAt && (
          <ThemedText>
            Data de criação: {new Date(data.createdAt).toLocaleString("pt-BR")}
          </ThemedText>
        )}
        {canComplaintData?.canSubmit && (
          <Button
            text="Denunciar código"
            icon={{ name: "report", provider: "MaterialIcons" }}
            onPress={() => router.push(`/${data!.id}/report`)}
            colorScheme="red"
            style={{ marginTop: 40 }}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
