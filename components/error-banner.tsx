import { Colors } from "@/constants/theme";
import { QueryError } from "@/services/query-handler";
import { mapQueryError } from "@/utils/error-mapper";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ErrorBannerProps {
  error?: unknown;
  messages?: string[]; // opcional: mensagens adicionais externas
  onClose?: () => void;
  testID?: string;
  title?: string;
}

export default function ErrorBanner({
  error,
  messages,
  onClose,
  testID,
  title = "Ocorreram erros",
}: ErrorBannerProps) {
  const derivedMessages = useMemo(() => {
    const list: string[] = [];
    if (error) {
      if (error instanceof QueryError) {
        list.push(...mapQueryError(error));
      } else if (error instanceof Error) {
        list.push(error.message || "Erro inesperado. Tente novamente.");
      } else if (typeof error === "string") {
        list.push(error);
      } else {
        list.push("Erro inesperado. Tente novamente.");
      }
    }
    if (messages && messages.length) list.push(...messages);
    return Array.from(new Set(list));
  }, [error, messages]);

  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (derivedMessages.length) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [derivedMessages]);

  function handleClose() {
    setIsVisible(false);
    onClose?.();
  }

  if (!isVisible || derivedMessages.length === 0) return null;

  return (
    <View style={styles.container} testID={testID || "error-banner"}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity accessibilityRole="button" onPress={handleClose}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>
      {derivedMessages.map((m, i) => (
        <Text key={i} style={styles.message}>
          • {m}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FDECEC",
    borderLeftWidth: 4,
    borderLeftColor: Colors.error || "#D62828",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontWeight: "600",
    color: Colors.error || "#D62828",
    fontSize: 14,
  },
  close: {
    fontSize: 16,
    color: Colors.error || "#D62828",
    paddingHorizontal: 4,
  },
  message: {
    color: Colors.text || "#222",
    fontSize: 13,
    lineHeight: 18,
  },
});
