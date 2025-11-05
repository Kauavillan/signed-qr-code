import { Colors } from "@/constants/theme";
import { View, ViewStyle } from "react-native";

interface CornerProps {
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  size?: number;
  borderWidth?: number;
  color?: string;
}

export default function Corner({
  position,
  size = 100,
  borderWidth = 5,
  color = Colors.tint,
}: CornerProps) {
  const cornerStyles: Record<typeof position, ViewStyle> = {
    topLeft: {
      top: 0,
      left: 0,
      borderTopColor: color,
      borderLeftColor: color,
      borderBottomColor: "transparent",
      borderRightColor: "transparent",
      borderTopLeftRadius: 10,
    },
    topRight: {
      top: 0,
      right: 0,
      borderTopColor: color,
      borderRightColor: color,
      borderBottomColor: "transparent",
      borderLeftColor: "transparent",
      borderTopRightRadius: 10,
    },
    bottomLeft: {
      bottom: 0,
      left: 0,
      borderBottomColor: color,
      borderLeftColor: color,
      borderTopColor: "transparent",
      borderRightColor: "transparent",
      borderBottomLeftRadius: 10,
    },
    bottomRight: {
      bottom: 0,
      right: 0,
      borderBottomColor: color,
      borderRightColor: color,
      borderTopColor: "transparent",
      borderLeftColor: "transparent",
      borderBottomRightRadius: 10,
    },
  };

  return (
    <View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderWidth,
        },
        cornerStyles[position],
      ]}
    />
  );
}
