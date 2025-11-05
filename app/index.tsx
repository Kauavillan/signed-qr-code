import CustomPressable from "@/components/custom-pressable";
import Icon from "@/components/icons";
import Corner from "@/components/ui/corner";
import sizes from "@/constants/sizes";
import { Colors } from "@/constants/theme";
import { BarcodeScanningResult, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [scannedData, setScannedData] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  function handleQrCode(result: BarcodeScanningResult) {
    if (result.data === scannedData) return;
    console.log("QR Code scanned:", result);
    setIsProcessing(true);
    setScannedData(result.data);
    setTimeout(() => {
      setIsProcessing(false);
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
            <Icon
              provider="Feather"
              name="loader"
              size={50}
              color="white"
              style={{ opacity: 0.8 }}
            />
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
