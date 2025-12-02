import Button from "@/components/button";
import CustomPressable from "@/components/custom-pressable";
import Icon from "@/components/icons";
import { ThemedText } from "@/components/themed-text";
import Corner from "@/components/ui/corner";
import sizes from "@/constants/sizes";
import { Colors } from "@/constants/theme";
import { useFocusEffect } from "@react-navigation/native";
import {
  BarcodeScanningResult,
  Camera,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { AppState, Linking, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [foregroundPermission, setForegroundPermission] =
    React.useState(permission);
  const [torchOn, setTorchOn] = useState(false);
  const [scannedData, setScannedData] = React.useState<string | null>(null);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);

  // Sincroniza estado local quando hook mudar
  React.useEffect(() => {
    setForegroundPermission(permission);
  }, [permission]);

  // Solicita permissão inicial com modal se possível
  React.useEffect(() => {
    if (
      foregroundPermission &&
      !foregroundPermission.granted &&
      foregroundPermission.canAskAgain &&
      !hasAskedPermission
    ) {
      setHasAskedPermission(true);
      requestPermission();
    }
  }, [foregroundPermission, requestPermission, hasAskedPermission]);

  // Revalida permissão ao voltar para foreground
  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        try {
          const updated = await Camera.getCameraPermissionsAsync();
          setForegroundPermission(updated);
        } catch (e) {
          // Silencia erros de leitura de permissão
          console.warn("Falha ao atualizar permissão da câmera", e);
        }
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  // Revalida permissão sempre que a tela ganhar foco (ex: navegação de volta)
  useFocusEffect(
    React.useCallback(() => {
      setScannedData(null);
      let active = true;
      (async () => {
        try {
          const updated = await Camera.getCameraPermissionsAsync();
          if (active) {
            setForegroundPermission(updated);
          }
        } catch (e) {
          console.warn("Falha ao atualizar permissão (focus)", e);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  function handleQrCode(result: BarcodeScanningResult) {
    if (result.data === scannedData) return;
    setScannedData(result.data);
    router.push({
      pathname: "/qr-code-info",
      params: { codeData: result.data },
    });
    setTorchOn(false);
  }

  // Enquanto o status da permissão é carregado
  if (!foregroundPermission) {
    return <View style={styles.container} />;
  }

  // Caso a permissão não tenha sido concedida, mostra mensagem e ação
  if (!foregroundPermission.granted) {
    return (
      <View style={[styles.container, { paddingTop: top + 10 }]}>
        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          <CustomPressable
            onPress={() => router.push("/login")}
            style={{
              backgroundColor: "white",
              marginRight: sizes.vw.borderMargin,
              borderRadius: 300,
            }}
          >
            <Icon
              provider="Ionicons"
              name="person-circle"
              color={Colors.tint}
              size={30}
            />
          </CustomPressable>
        </View>

        <View style={styles.permissionContainer}>
          <ThemedText style={styles.permissionTitle}>
            Permissão de câmera necessária
          </ThemedText>
          <ThemedText style={styles.permissionMessage}>
            Para ler os QR codes, você precisa aceitar as permissões de câmera.
          </ThemedText>
          {foregroundPermission.canAskAgain ? (
            <Button
              text="Permitir acesso à câmera"
              onPress={requestPermission}
            />
          ) : (
            <Button
              text="Habilitar nas configurações"
              onPress={Linking.openSettings}
            />
          )}
        </View>
      </View>
    );
  }
  console.log("Foreground permission: ", foregroundPermission);
  return (
    <>
      <CameraView
        enableTorch={torchOn}
        key={
          foregroundPermission?.granted ? "camera-granted" : "camera-pending"
        }
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleQrCode}
        style={styles.container}
      />
      <View style={{ paddingTop: top + 10 }}>
        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          <CustomPressable
            onPress={() => router.push("/login")}
            style={{
              backgroundColor: "white",
              marginRight: sizes.vw.borderMargin,
              borderRadius: 300,
            }}
          >
            <Icon
              provider="Ionicons"
              name="person-circle"
              color={Colors.tint}
              size={30}
            />
          </CustomPressable>
        </View>
      </View>
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frame}>
          <Corner position="topLeft" />
          <Corner position="topRight" />
          <Corner position="bottomLeft" />
          <Corner position="bottomRight" />
        </View>
      </View>
      <View style={styles.refreshButtonContainer}>
        <CustomPressable
          onPress={async () => {
            try {
              const updated = await Camera.getCameraPermissionsAsync();
              setForegroundPermission(updated);
            } catch (e) {
              console.warn("Falha ao recarregar permissão", e);
            }
          }}
          style={styles.roundButton}
        >
          <Icon provider="Ionicons" name="refresh" color="white" size={18} />
        </CustomPressable>
      </View>
      <View style={styles.lanternButtonContainer}>
        <CustomPressable
          onPress={() => setTorchOn(!torchOn)}
          style={[
            styles.roundButton,
            {
              backgroundColor: torchOn ? Colors.primary : Colors.grey,
            },
          ]}
        >
          <Icon
            provider="MaterialIcons"
            name={torchOn ? "flashlight-off" : "flashlight-on"}
            color="white"
            size={18}
          />
        </CustomPressable>
      </View>
    </>
  );
}

const FRAME_SIZE = sizes.vw.qrCodeFrameSize;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  permissionMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.8,
  },
  roundButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 50,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  refreshButtonContainer: { position: "absolute", bottom: 40, right: 20 },
  lanternButtonContainer: { position: "absolute", bottom: 100, right: 20 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: "relative",
  },
});
