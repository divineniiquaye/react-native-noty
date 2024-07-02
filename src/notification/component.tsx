import {
  Animated,
  StatusBar,
  PanResponder,
  type ViewStyle,
  type GestureResponderEvent,
  type PanResponderGestureState,
  type LayoutChangeEvent,
  Platform,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DEFAULT_SWIPE_ENABLED, HideTypes } from "../constants";
import { type Timeout, timeout } from "../handler";
import type { NotificationProps } from "./types";
import { ToastColor } from "../toast/types";

type Props = NotificationProps & {
  onPress?: () => void;
  setVisible: (visible: 0 | 1 | 2) => void;
  dismiss: (props?: any) => void;
  content: React.FC;
  interval: number;
  visible: 0 | 1 | 2;
};

const NotificationComponent = (
  {
    updateStatusBar = true,
    content: Component,
    type = "success",
    position = "top",
    alertColors,
    interval,
    visible,
    setVisible,
    dismiss,
    inactiveStatusBar,
    animatedViewStyle,
    animatedViewProps,
    panResponderEnabled = DEFAULT_SWIPE_ENABLED,
    panResponderDismissDistance = -10,
    springAnimationConfig = {
      toValue: 0,
      friction: 9,
      useNativeDriver: false,
      isInteraction: false,
    },
  }: Props,
  ref: React.Ref<Timeout>,
) => {
  const windowDimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const animatedValue = React.useRef(new Animated.Value(0));
  const [dimValue, setDimValue] = React.useState(0);
  const [height, setHeight] = React.useState(99);

  React.useEffect(() => {
    if (1 == visible) {
      _updateStatusBar(true);
      _animate(1);
    } else if (2 === visible) _dismiss(true);
  }, [visible]);

  function _onLayout(event: LayoutChangeEvent) {
    const eventHeight = event.nativeEvent.layout.height;
    if (eventHeight > height) {
      setHeight(eventHeight);
    }
  }

  function _updateStatusBar(active = false) {
    if (!updateStatusBar) return;
    if (position === "top") {
      StatusBar.setBarStyle(
        active
          ? "light-content"
          : inactiveStatusBar ??
              Platform.select({ android: "dark-content", default: "default" }),
        true,
      );
    }
  }

  async function _dismiss(type: HideTypes | true) {
    _updateStatusBar(false);
    _animate(0);
    setDimValue(0);

    if (typeof type === "string") {
      dismiss(type);
    } else {
      setVisible(0);
    }
  }

  function _animate(toValue = 0) {
    springAnimationConfig.toValue = toValue;
    Animated.spring(animatedValue.current, springAnimationConfig).start(
      async ({ finished }) => {
        if (finished && 1 === toValue && interval > 0) {
          await timeout(interval, ref as any);
          _dismiss(HideTypes.AUTO_DISMISS);
        }
      },
    );
  }

  function _getViewAnimatedStyle() {
    let viewStyle: ViewStyle = {
      backgroundColor: alertColors?.[type] ?? ToastColor[type] ?? "black",
      position: Platform.select({
        web: "fixed",
        default: "absolute",
      }) as "absolute",
      top: dimValue,
      padding: 8,
      left: 0,
      right: 0,
      elevation: 1,
      zIndex: 1,
    };
    let animatedInterpolateConfig = {
      inputRange: [0, 1],
      outputRange: [0 - height, 0],
    };
    if (position === "bottom") {
      viewStyle.top = undefined;
      viewStyle.bottom = dimValue;
      animatedInterpolateConfig.outputRange[0] =
        windowDimensions.height - height;
    }
    return [
      viewStyle,
      {
        transform: [
          {
            translateY: animatedValue.current.interpolate(
              animatedInterpolateConfig,
            ),
          },
        ],
      },
      animatedViewStyle,
    ];
  }

  function _getPanResponder() {
    function _onDonePan(
      _event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ) {
      if (panResponderEnabled) {
        switch (position) {
          case "bottom":
            if (gestureState.dy >= Math.abs(panResponderDismissDistance)) {
              _dismiss(HideTypes.PAN_DISMISS);
            }
            break;

          default:
            if (gestureState.dy <= panResponderDismissDistance) {
              _dismiss(HideTypes.PAN_DISMISS);
            }
            break;
        }
      }
    }
    return PanResponder.create({
      onStartShouldSetPanResponder: () => panResponderEnabled,
      onMoveShouldSetPanResponder: () => panResponderEnabled,
      onPanResponderMove: (_event, gestureState) => {
        if (panResponderEnabled) {
          switch (position) {
            case "bottom":
              if (gestureState.dy > 0) {
                setDimValue(0 - gestureState.dy);
              }
              break;

            default:
              if (gestureState.dy < 0) {
                setDimValue(gestureState.dy);
              }
              break;
          }
        }
      },
      onPanResponderRelease: (event, gestureState) =>
        _onDonePan(event, gestureState),
      onPanResponderTerminate: (event, gestureState) =>
        _onDonePan(event, gestureState),
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const panResponder = React.useMemo(_getPanResponder, [
    panResponderEnabled,
    panResponderDismissDistance,
    position,
  ]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={_getViewAnimatedStyle()}
      onLayout={(event) => _onLayout(event)}
      {...animatedViewProps}
    >
      <View
        style={
          "top" === position
            ? { paddingTop: insets.top }
            : "bottom" === position
              ? {
                  paddingVertical:
                    "ios" === Platform.OS
                      ? insets.bottom
                      : (insets.bottom || insets.top) / 2,
                }
              : undefined
        }
        children={Component as any}
      />
    </Animated.View>
  );
};

export default React.forwardRef(NotificationComponent);
