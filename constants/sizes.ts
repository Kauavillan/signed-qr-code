import { Dimensions } from "react-native";

function getWindowSizes(type: "width" | "height", percentage: number): number {
  return Dimensions.get("window")[type] * (percentage / 100);
}

const viewWidthPercentage = 90;

const vw = {
  globalViewWidth: getWindowSizes("width", viewWidthPercentage),
  borderMargin: getWindowSizes("width", (100 - viewWidthPercentage) / 2),
  qrCodeFrameSize: getWindowSizes("width", 80),
  100: getWindowSizes("width", 100),
  get: (percentage: number) => getWindowSizes("width", percentage),
};
const vh = {
  100: getWindowSizes("height", 100),
  get: (percentage: number) => getWindowSizes("height", percentage),
};

const sizes = {
  spacing: {
    screenPadding: vw.borderMargin,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
  vw,
  vh,
};

export default sizes;
