import { ReactNode } from "react";
import { View } from "react-native";

interface InputsContainerProps {
  spacing?: number;
  children: ReactNode;
}

export default function InputsContainer({
  spacing = 16,
  children,
}: InputsContainerProps) {
  return <View style={{ gap: spacing }}>{children}</View>;
}
