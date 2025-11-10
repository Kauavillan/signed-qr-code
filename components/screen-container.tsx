import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_PADDING = 20;

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  /** Se true, adiciona padding também nas áreas seguras (top/bottom) */
  includeSafeArea?: boolean;
  /** Se true, remove o padding horizontal */
  noPaddingHorizontal?: boolean;
  /** Se true, remove o padding vertical */
  noPaddingVertical?: boolean;
}

export default function ScreenContainer({
  children,
  includeSafeArea = true,
  noPaddingHorizontal = false,
  noPaddingVertical = false,
  style,
  ...props
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: includeSafeArea ? insets.top : undefined,
          paddingBottom: includeSafeArea ? insets.bottom : undefined,
          paddingHorizontal: noPaddingHorizontal ? 0 : SCREEN_PADDING,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
