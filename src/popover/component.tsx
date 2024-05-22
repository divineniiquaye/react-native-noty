import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  type LayoutChangeEvent,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import React from "react";

import { HideTypes } from "../constants";
import { getCoordinates, getPosition, RENDER_BOUNDARY } from "./utils";
import { type Timeout, timeout } from "../handler";
import SafeAreaView from "../safeview";
import type { PopOverProps } from ".";

type Config = Omit<PopOverProps, "active" | "onDismiss"> & {
  layout: LayoutChangeEvent["nativeEvent"]["layout"];
  target: number;
};

type Props = {
  config: Config[];
  dismiss: (props?: any) => void;
  onPress?: () => void;
  visible: 0 | 1 | 2;
};

const PopOverComponent = (
  { config = [], visible, dismiss }: Props,
  ref: React.Ref<Timeout>,
) => {
  const [state, setState] = React.useState<Record<string, any>>({ next: 0 });
  const theme = useColorScheme();

  const animation = new Animated.Value(0);
  const overlayAnimation = new Animated.Value(0);
  const pulseAnim = new Animated.Value(0);

  const {
    activeItemStyle = {},
    dismissible = true,
    overlayOpacity = 0.6,
    interval = 0,
    content,
    layout,
    target,
    style,
    children,
    onPress,
  } = React.useDeferredValue(config[state.next] as Config);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        dismiss(HideTypes.BACK_BUTTON_PRESSED);
        return true;
      },
    );
    return backHandler.remove;
  }, []);

  React.useEffect(() => {
    if (1 == visible) _animateIn();
  }, [visible, target]);

  async function _onLayout(e: LayoutChangeEvent) {
    if (state?.tipHasProps) return;

    const { height, width } = e.nativeEvent.layout;
    const coords = state?.coordinates ?? (await getCoordinates(target));
    setState({ next: state.next, ...getPosition(coords, height, width) });
  }

  function _animateIn() {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: 1,
        duration: 250,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 1,
        duration: 250,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }

  function _animateOut(next: number = 0) {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      pulseAnim.setValue(0);
      animation.setValue(0);
      overlayAnimation.setValue(0);
      setState({ next });
    });
  }

  function _renderOverlay() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (dismissible) {
            _animateOut();
            dismiss(HideTypes.BACKDROP_PRESSED);
          }
        }}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: `rgba(0,0,0,${overlayOpacity || 0.6})` },
          ]}
        />
      </TouchableWithoutFeedback>
    );
  }

  function _renderPopOver() {
    return (
      <Animated.View
        onLayout={_onLayout}
        style={[
          styles.tip,
          {
            backgroundColor: "dark" === theme ? "#303030" : "white",
            maxWidth: Dimensions.get("screen").width - RENDER_BOUNDARY * 20,
            opacity: animation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0, 1],
            }),
            ...state?.position,
          },
          style,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPress?.("default")}
        >
          {typeof content === "string" ? (
            <Text
              style={{
                color:
                  "dark" === theme
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(0, 0, 0, 0.9)",
                fontSize: 16,
              }}
              children={content}
            />
          ) : typeof content === "function" ? (
            content({})
          ) : (
            <View>
              <Text
                style={{
                  color:
                    "dark" === theme ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
                  fontWeight: "500",
                  fontSize: 17.4,
                }}
                children={content.title}
              />
              {typeof content.body === "string" ? (
                <Text
                  style={{
                    color:
                      "dark" == theme
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(0, 0, 0, 0.9)",
                    fontSize: 16,
                    marginTop: 8,
                  }}
                  children={content.body}
                />
              ) : (
                content.body({})
              )}
            </View>
          )}
          {config.length > 1 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 14,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  // @ts-ignore
                  if (ref.current) clearTimeout(ref.current);
                  _animateOut();
                  dismiss(HideTypes.PRESSED);
                }}
              >
                <Text
                  style={{ color: "#cd853f", fontSize: 16, fontWeight: "500" }}
                >
                  Skip
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  backgroundColor: "#EBECF2",
                  borderRadius: 6,
                  padding: 10,
                  width: 70,
                }}
                onPress={async () => {
                  // @ts-ignore
                  if (ref.current) clearTimeout(ref.current);
                  if (config.length > state.next + 1) {
                    _animateOut(state.next + 1);
                  } else {
                    _animateOut();
                    dismiss(HideTypes.PRESSED);
                  }
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  {config.length === state.next + 1 ? "Done" : "Next"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  function _renderItem() {
    const coordinates = {
      position: "absolute" as "absolute",
      width: layout.width,
      height: layout.height,
      top: state.coordinates.centerPoint.y as number,
      left: state.coordinates.centerPoint.x as number,
      transform: [
        { translateX: -layout.width / 2 },
        { translateY: -layout.height / 2 },
      ],
    };

    // @ts-ignore
    const item = React.cloneElement(children, {
      // @ts-ignore
      ...children.props,
      // onPressOut: () => onPressItem && onPressItem(),
      style: [
        // @ts-ignore
        children.props?.style,
        {
          margin: 0,
          bottom: 0,
          right: 0,
          left: 0,
          top: 0,
        },
      ],
    });

    return (
      <View style={[coordinates, activeItemStyle]}>
        <TouchableOpacity
          style={{
            position: "absolute",
            backgroundColor: "white",
            width: layout.width + 12,
            height: layout.height + 12,
            borderRadius: 6,
            bottom: -6,
            left: -6,
            top: -6,
          }}
          onPress={() => onPress?.("view")}
          activeOpacity={0.8}
        />
        {item}
      </View>
    );
  }

  return (
    <Modal
      visible={1 === visible}
      animationType="fade"
      onRequestClose={() => dismiss(HideTypes.PRESSED)}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}
      hardwareAccelerated={true}
      transparent={true}
      onShow={async () => {
        if (interval > 0) {
          await timeout(interval, ref as any);

          if (config.length === state.next + 1) {
            dismiss(HideTypes.AUTO_DISMISS);
          } else {
            _animateOut(state.next + 1);
          }
        }
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {_renderOverlay()}
        {_renderPopOver()}
        {state.coordinates && _renderItem()}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tip: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    zIndex: 999999,
    overflow: "visible",
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-end",
  },
  actionBtn: {
    padding: 10,
    marginBottom: -10,
  },
  actionBtnLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  prev: {
    marginRight: 10,
  },
});

export default React.forwardRef(PopOverComponent);
