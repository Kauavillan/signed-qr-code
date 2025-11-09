import CustomPressable from "@/components/custom-pressable";
import Icon from "@/components/icons";
import Corner from "@/components/ui/corner";
import sizes from "@/constants/sizes";
import { Colors } from "@/constants/theme";
import { BarcodeScanningResult, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import Pako from "pako";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [scannedData, setScannedData] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  function decompressQRData(data: string): string {
    try {
      // Tenta identificar se é um dado comprimido (base64)
      // Verifica se a string contém apenas caracteres válidos de base64
      const base64Regex = /^[A-Za-z0-9+/]+=*$/;

      if (!base64Regex.test(data)) {
        // Não é base64, retorna o texto plano
        return data;
      }

      try {
        // Tenta decodificar de base64
        const binaryString = atob(data);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Tenta descomprimir usando pako
        const decompressed = Pako.inflate(bytes, { to: "string" });

        // Verifica se o resultado descomprimido é um JSON válido
        // (assumindo que os QR codes do app sempre contêm JSON)
        JSON.parse(decompressed);

        return decompressed;
      } catch (decompressError) {
        // Se falhar ao descomprimir, provavelmente é texto plano em base64
        // ou apenas texto plano que coincidentemente passou no regex
        return data;
      }
    } catch (error) {
      console.error("Erro ao processar dados do QR code:", error);
      return data;
    }
  }

  function handleQrCode(result: BarcodeScanningResult) {
    if (result.data === scannedData) return;

    const processedData = decompressQRData(result.data);
    console.log("QR Code scanned (raw):", result.data);
    console.log("QR Code scanned (processed):", processedData);

    setIsProcessing(true);
    setScannedData(result.data);
    setTimeout(() => {
      setIsProcessing(false);
      setScannedData(null);
    }, 10000);
  }

  return (
    <CameraView
      barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      onBarcodeScanned={handleQrCode}
      style={styles.container}
    >
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
          {isProcessing ? (
            <ActivityIndicator size={"large"} color={Colors.tint} />
          ) : (
            <>
              <Corner position="topLeft" />
              <Corner position="topRight" />
              <Corner position="bottomLeft" />
              <Corner position="bottomRight" />
            </>
          )}
        </View>
        <View></View>
      </View>
    </CameraView>
  );
}

const FRAME_SIZE = sizes.vw.qrCodeFrameSize;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
