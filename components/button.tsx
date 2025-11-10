import { Colors } from "@/constants/theme";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import CustomPressable, { CustomPressableProps } from "./custom-pressable";

interface ButtonProps extends CustomPressableProps {
  onPress: () => void;
  text: string;
  loading?: boolean;
  colorScheme?: "primary" | "secondary";
}

export default function Button({
  onPress,
  text,
  colorScheme = "primary",
  loading = false,
  ...rest
}: ButtonProps) {
  const colors = { background: "", text: "" };
  switch (colorScheme) {
    case "primary":
      colors.background = Colors.primary;
      colors.text = "white";
      break;
    case "secondary":
      colors.background = Colors.secondary;
      colors.text = "white";
      break;
  }
  return (
    <CustomPressable
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: colors.background },
        rest.style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : (
        <Text style={{ color: colors.text }}>{text}</Text>
      )}
    </CustomPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
