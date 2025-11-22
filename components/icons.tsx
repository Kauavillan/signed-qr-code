import * as VectorIcons from "@expo/vector-icons";
import React from "react";
import { StyleProp, TextStyle } from "react-native";

type IconProvider = keyof typeof VectorIcons;

export interface IconProps {
  provider: IconProvider;
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export default function Icon({
  provider,
  name,
  size = 24,
  color = "#000",
  style,
}: IconProps) {
  const IconComponent = VectorIcons[provider] as any;

  if (!IconComponent) {
    console.warn(`Icon provider "${provider}" not found`);
    return null;
  }

  return <IconComponent name={name} size={size} color={color} style={style} />;
}

// Componentes auxiliares para facilitar o uso dos provedores mais comuns
export function MaterialIcon(props: Omit<IconProps, "provider">) {
  return <Icon {...props} provider="MaterialIcons" />;
}

export function MaterialCommunityIcon(props: Omit<IconProps, "provider">) {
  return <Icon {...props} provider="MaterialCommunityIcons" />;
}

export function FontAwesomeIcon(props: Omit<IconProps, "provider">) {
  return <Icon {...props} provider="FontAwesome" />;
}

export function FontAwesome5Icon(props: Omit<IconProps, "provider">) {
  return <Icon {...props} provider="FontAwesome5" />;
}

export function IoniconsIcon(props: Omit<IconProps, "provider">) {
  return <Icon {...props} provider="Ionicons" />;
}

export function FeatherIcon(props: Omit<IconProps, "provider">) {
  return <Icon {...props} provider="Feather" />;
}

export function AntDesignIcon(props: Omit<IconProps, "provider">) {
  return <Icon {...props} provider="AntDesign" />;
}

export function EntypoIcon(props: Omit<IconProps, "provider">) {
  return <Icon {...props} provider="Entypo" />;
}
