import { StatusBarStyle } from "react-native";
import { ToastProps } from "../toast/types";

export type NotificationProps = Omit<ToastProps, "position" | "interval"> & {
  position?: "top" | "bottom";
  inactiveStatusBar?: StatusBarStyle;
  updateStatusBar?: boolean;

  panResponderEnabled?: boolean;
  /**
   * Distance on the Y-axis for the alert to be dismissed by pan gesture
   * @default -10
   */
  panResponderDismissDistance?: number;
};
