import { Dimensions } from "react-native";

function getWindowSizes(type: "width" | "height", percentage: number): number {
  return Dimensions.get("window")[type] * (percentage / 100);
}

const viewWidthPercentage = 90;

const sizes = {
  vw: {
    globalViewWidth: getWindowSizes("width", viewWidthPercentage),
    borderMargin: getWindowSizes("width", (100 - viewWidthPercentage) / 2),
    qrCodeFrameSize: getWindowSizes("width", 80),
    100: getWindowSizes("width", 100),
  },
};

export default sizes;
