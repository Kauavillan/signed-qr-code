import ScreenContainer from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import { useLocalSearchParams } from "expo-router";

export default function QrCodeInfo() {
  const { codeData }: { codeData: string } = useLocalSearchParams();
  return (
    <ScreenContainer>
      <ThemedText>QR Code Info Screen</ThemedText>
      <ThemedText>Data: {codeData}</ThemedText>
    </ScreenContainer>
  );
}
