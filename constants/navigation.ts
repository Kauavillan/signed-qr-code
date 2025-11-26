import { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { Platform } from "react-native";
import { Colors } from "./theme";

export const defaultHeaderOptions: ExtendedStackNavigationOptions = {
  headerStyle: {
    backgroundColor: Colors.background,
  },
  headerTitleStyle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.text,
  },
  headerTintColor: Colors.tint,
  headerTitleAlign: "center",
  headerShadowVisible: false,
  animation: Platform.OS === "ios" ? "default" : "fade",
};
