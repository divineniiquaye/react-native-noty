import { Animated, StyleSheet, View } from "react-native";
import React from "react";

import { DEFAULT_DURATION, HideTypes } from "../constants";
import { ToastColor, type ToastProps } from "./types";
import { type Timeout, timeout } from "../handler";

type Props = ToastProps & {
  setVisible: (visible: 0 | 1 | 2) => void;
  dismiss: (props?: any) => void;
  visible: 0 | 1 | 2;
  content: React.FC;
};

const ToastComponent = (
  {
    interval = DEFAULT_DURATION,
    content: Component,
    position = "center",
    type = "default",
    alertColors,
    visible,
    dismiss,
  }: Props,
  ref: React.Ref<Timeout>,
) => {
  const animatedValue = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    if (1 == visible) {
      Animated.timing(animatedValue.current, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(async () => {
        await timeout(interval, ref as any);
        Animated.timing(animatedValue.current, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          dismiss(HideTypes.AUTO_DISMISS);
        });
      });
    }
  }, [visible]);

  function _getPositionStyle(position: string) {
    switch (position) {
      case "top":
        return styles.top;
      case "center":
        return styles.center;
      case "bottom":
        return styles.bottom;
      default:
        return styles.center;
    }
  }

  return (
    1 === visible && (
      <View style={[styles.toastContainer, _getPositionStyle(position)]}>
        <Animated.View
          style={[
            styles.toast,
            {
              backgroundColor: alertColors?.[type] ?? ToastColor?.[type],
              opacity: animatedValue.current.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          {Component as any}
        </Animated.View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    alignItems: "center",
    elevation: 999_999,
    zIndex: 1000,
    right: 0,
    left: 0,
  },
  toast: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 8,
  },
  top: {
    top: "7%",
  },
  center: {
    top: "50%",
    transform: [{ translateY: -50 }],
  },
  bottom: {
    bottom: "10%",
  },
});

export default React.forwardRef(ToastComponent);
