import { Image, ImageProps } from "react-native";

interface Props extends ImageProps {
  size?: number;
}
export default function Logo({ size = 300, style, ...rest }: Props) {
  return (
    <Image
      source={require("@assets/images/logo.png")}
      style={[{ width: size, height: size, alignSelf: "center" }, style]}
      resizeMode="contain"
    />
  );
}
