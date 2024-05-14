import { Animated, ColorValue, View } from "react-native";

export const NotificationColor = {
  info: "#2b73b6",
  warn: "#cd853f",
  error: "#cc3232",
  success: "#32a54a",
};

export type NotificationProps = {
  type?: "info" | "success" | "error" | "warn";
  position?: "top" | "bottom";
  updateStatusBar?: boolean;
  alertColors?: {
    info?: ColorValue;
    success?: ColorValue;
    error?: ColorValue;
    warn?: ColorValue;
  };

  animatedViewStyle?: View["props"]["style"];
  animatedViewProps?: Omit<View["props"], "style">;
  springAnimationConfig?: Animated.SpringAnimationConfig;
  panResponderEnabled?: boolean;
  /**
   * Distance on the Y-axis for the alert to be dismissed by pan gesture
   * @default -10
   */
  panResponderDismissDistance?: number;
};
