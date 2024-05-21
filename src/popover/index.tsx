import { TouchableWithoutFeedback, View } from "react-native";
import React from "react";

import { Noty } from "../handler";

export type PopOverProps = React.PropsWithChildren<{
  /** The tip's id, useful to control it. */
  id: string;

  /**
   * If true the item becomes pressable and shows the tip automatically when pressed.
   * @default true
   */
  active?: boolean;

  /** Style of the item wrapper component: `<PopOver style={style}>`. */
  style?: View["props"]["style"];

  /** Style for the item when the popover is open. */
  activeItemStyle?: View["props"]["style"];

  /** The content of the popover. */
  content: React.FC | string | { title: string; body: React.FC | string };

  /** Set the interval between each tip else close. */
  interval?: number;

  /**
   * Set opacity intensity of overlay.
   * @default 0.6
   */
  overlayOpacity?: number;

  /** Allow auto dismiss on touch overlay. */
  dismissible?: boolean;

  /**
   * Trigger your custom action on popover press.
   * @param type 'view' for click the highlighted view or 'default' to click the popover
   */
  onPress?: (type: "view" | "default") => void;

  /** This function will be called when the popover is dismissed. */
  onDismiss?: (data?: any) => void;
}>;

export const PopOver: React.FC<PopOverProps> = ({
  id,
  active = true,
  onDismiss,
  children,
  ...props
}) => (
  <TouchableWithoutFeedback
    onPress={async () => {
      const result = await Noty.popover(id);
      onDismiss?.(result);
    }}
    children={children}
    disabled={!active}
    onLayout={(e) =>
      Noty.popover(id, {
        // @ts-ignore
        target: e.nativeEvent.target,
        layout: e.nativeEvent.layout,
        children: children,
        ...props,
      })
    }
  />
);
