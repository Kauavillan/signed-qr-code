import { Colors } from "@/constants/theme";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import CustomPressable, { CustomPressableProps } from "./custom-pressable";
import Icon, { IconProps } from "./icons";
import { ThemedText } from "./themed-text";

interface ButtonProps extends CustomPressableProps {
  onPress: () => void;
  text: string;
  isLoading?: boolean;
  width?: number | "full" | "content-only";
  colorScheme?: "primary" | "secondary" | "red";
  icon?: IconProps;
}

export default function Button({
  onPress,
  text,
  colorScheme = "primary",
  width = "full",
  isLoading = false,
  icon,
  style,
  ...rest
}: ButtonProps) {
  const buttonWidth: StyleProp<ViewStyle> =
    width === "full"
      ? { width: "100%" }
      : width === "content-only"
      ? { alignSelf: "flex-start" }
      : { width: width };
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
    case "red":
      colors.background = Colors.error;
      colors.text = "white";
      break;
  }
  return (
    <CustomPressable
      onPress={onPress}
      style={[
        styles.button,
        buttonWidth,
        { backgroundColor: colors.background },
        style,
      ]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <ThemedText style={{ color: colors.text }}>{text}</ThemedText>
          {icon && <Icon color={colors.text} {...icon} />}
        </View>
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
