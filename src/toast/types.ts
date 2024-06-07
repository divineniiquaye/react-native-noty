import { Animated, Appearance, type ColorValue, View } from "react-native";

export const ToastColor = {
  default: "dark" === Appearance.getColorScheme() ? "#1B2534" : "#636975",
  success: "#28A745",
  error: "#D75640",
  info: "#D1ECF1",
  warn: "#FFF3CD",
};

export type ToastProps = {
  type?: "info" | "success" | "error" | "warn" | "default";
  position?: "top" | "bottom" | "center";
  alertColors?: {
    info?: ColorValue;
    success?: ColorValue;
    error?: ColorValue;
    warn?: ColorValue;
    default?: ColorValue;
  };

  interval?: number;
  animatedViewStyle?: View["props"]["style"];
  animatedViewProps?: Omit<View["props"], "style">;
  springAnimationConfig?: Animated.SpringAnimationConfig;
}
