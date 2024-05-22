import { Animated, Appearance, type ColorValue, View } from "react-native";

export const ToastColor = {
  default: "dark" === Appearance.getColorScheme() ? "#1B2534" : "#636975",
  success: "#32a54a",
  error: "#cc3232",
  info: "#2b73b6",
  warn: "#cd853f",
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
