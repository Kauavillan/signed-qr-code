import Button from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import sizes from "@/constants/sizes";
import { useAuth } from "@/contexts/AuthContext";
import type { QrCodeItem } from "@/hooks/api/qr-codes/queries";
import { useInfiniteUserQrCodes } from "@/hooks/api/qr-codes/queries";
import { saveOrSharePdf } from "@/utils/file-save";
import { buildQrPdfHtml } from "@/utils/pdf";
import { qrToDataURL } from "@/utils/qr";
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QrCodesList() {
  const { userId } = useAuth();
  const router = useRouter();
  console.log("QrCodesList - userId:", userId);
  const qrRefs = useRef<Record<string, QRCode | null>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isRefetching,
  } = useInfiniteUserQrCodes({ userId, limit: 8, enabled: true });

  const items = useMemo(() => {
    return data?.pages.flat() ?? [];
  }, [data]);

  const keyExtractor = useCallback((item: any) => String(item.id), []);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDownloadPdf = useCallback(async (item: QrCodeItem) => {
    try {
      setLoadingId(item.id);
      const ref = qrRefs.current[item.id];
      if (!ref) throw new Error("QR code não está pronto.");
      const dataUrl = await qrToDataURL(ref);
      const html = buildQrPdfHtml(item, dataUrl);
      const { uri } = await Print.printToFileAsync({ html });
      const safeIssuer = (item.issuerName || "QRCode").replace(
        /[^a-z0-9-_]+/gi,
        "_"
      );
      const filename = `QRCode_${safeIssuer}_${item.id}.pdf`;
      await saveOrSharePdf(uri, filename);
    } catch (err) {
      console.error("Erro ao gerar/baixar PDF:", err);
      Alert.alert(
        "Erro",
        Platform.select({
          android:
            "Não foi possível gerar o PDF. Verifique permissões e tente novamente.",
          default: "Não foi possível gerar o PDF.",
        }) || "Não foi possível gerar o PDF."
      );
    } finally {
      setLoadingId(null);
    }
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      onEndReached={onEndReached}
      ListHeaderComponent={
        <Button
          text="Criar novo QR Code"
          colorScheme="secondary"
          onPress={() => router.push("/issuer/qr-codes/generate-code")}
          style={{ marginBottom: 16 }}
          icon={{
            provider: "MaterialCommunityIcons",
            name: "qrcode-plus",
            size: 20,
          }}
        />
      }
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<ThemedText>Nenhum QR code encontrado.</ThemedText>}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={{ paddingVertical: 16 }}>
            <ActivityIndicator />
          </View>
        ) : null
      }
      renderItem={({ item }) => (
        <View
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: "#e5e5e5",
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <QRCode
              value={item.qrCodeText}
              size={sizes.vw.globalViewWidth * 0.8}
              getRef={(c) => {
                qrRefs.current[item.id] = c;
              }}
            />
          </View>
          <ThemedText style={{ fontWeight: "bold" }}>{item.content}</ThemedText>
          <ThemedText style={{ marginTop: 4, fontSize: 12, opacity: 0.6 }}>
            {new Date(item.createdAt).toLocaleString()}
          </ThemedText>
          <Button
            text="Baixar como pdf"
            icon={{ provider: "FontAwesome5", name: "file-pdf", size: 22 }}
            isLoading={loadingId === item.id}
            onPress={() => {
              void handleDownloadPdf(item);
            }}
          />
        </View>
      )}
    />
  );
}
