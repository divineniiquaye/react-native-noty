import { Animated, Platform, ViewStyle } from "react-native";
import React from "react";

import { DEFAULT_DURATION, HideTypes } from "../constants";
import { ToastColor, ToastProps } from "./types";
import SafeAreaView from "../safeview";
import { timeout } from "../handler";

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
    setVisible,
    dismiss,
    animatedViewProps,
    animatedViewStyle,
    springAnimationConfig = {
      toValue: 0,
      friction: 9,
      useNativeDriver: false,
      isInteraction: false,
    },
    ...props
  }: Props,
  ref: React.Ref<NodeJS.Timeout | null>,
) => {
  const animatedValue = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    if (1 == visible) {
      _animate(1);
    }
  }, [visible]);

  function _animate(toValue = 0) {
    springAnimationConfig.toValue = toValue;
    Animated.spring(animatedValue.current, springAnimationConfig).start(
      async ({ finished }) => {
        if (finished && 1 === toValue && interval > 0) {
          await timeout(interval, ref as any);
          _animate(0); // animation before dismiss
          dismiss(HideTypes.AUTO_DISMISS);
        }
      },
    );
  }

  function _getSafeAreaStyle() {
    let viewStyle: ViewStyle = {
      flex: 0,
      // fixed is available on web.
      position: (Platform.OS === "web" ? "fixed" : "absolute") as "absolute",
      top: "top" === position ? 0 : "center" === position ? "42%" : undefined,
      bottom: "bottom" === position ? 0 : undefined,
      alignSelf: "center",
      elevation: 999_999,
      maxWidth: "90%",
      zIndex: 999_999,
      ...(Platform.OS === "web"
        ? { overflow: "hidden", userSelect: "none" }
        : null),
    };

    if ("bottom" === position) {
      viewStyle.marginBottom = 20;
    } else if ("top" === position) {
      viewStyle.marginTop = 20;
    }

    return viewStyle;
  }

  function _getViewAnimatedStyle() {
    const viewStyle: ViewStyle = {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 9,
      width: "100%",
      elevation: 1,
      padding: 12,
      zIndex: 1,
      backgroundColor: alertColors?.[type] ?? ToastColor?.[type],
      opacity: animatedValue.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    };

    return [viewStyle, animatedViewStyle];
  }

  return (
    <SafeAreaView style={_getSafeAreaStyle()}>
      {1 === visible && (
        <Animated.View style={_getViewAnimatedStyle()} pointerEvents="box-none">
          {Component as any}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default React.forwardRef(ToastComponent);
