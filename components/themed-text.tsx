import { StyleSheet, Text, type TextProps } from "react-native";

import { Colors } from "@/constants/theme";

export type ThemedTextProps = TextProps & {
  color?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "small"
    | "link";
};

export function ThemedText({
  children,
  style,
  color = Colors.text,
  type = "default",
  ...rest
}: ThemedTextProps) {
  return (
    <Text style={[{ color }, styles[type], style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Inter_600SemiBold",
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "Inter_500Medium",
  },
});
