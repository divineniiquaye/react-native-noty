import {
  GestureResponderEvent,
  Platform,
  Modal,
  Pressable,
  View,
  BackHandler,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";

import SafeAreaView from "../safeview";
import { ModalProps } from "./types";

type Props = ModalProps & {
  onBackdropPress: (event: GestureResponderEvent) => void;
  onBackButtonPress: () => boolean | null | undefined;
  visible: 0 | 1 | 2;
  content: React.FC;
};

const ModalComponent: React.FC<Props> = ({
  content: Component,
  animationType = "fade",
  statusBarTranslucent = true,
  transparent = true,
  onBackButtonPress,
  onBackdropPress,
  position,
  style,
  visible,
  ...props
}) => {
  const modalStyle: View["props"]["style"] = {
    flex: 1,
    justifyContent:
      "top" === position
        ? "flex-start"
        : "bottom" === position
          ? "flex-end"
          : "center",
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackButtonPress,
    );
    return backHandler.remove;
  }, []);

  return (
    <Modal
      statusBarTranslucent={statusBarTranslucent}
      onRequestClose={onBackButtonPress}
      animationType={animationType}
      transparent={transparent}
      visible={1 === visible}
      {...props}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        pointerEvents="box-none"
      >
        <SafeAreaView style={modalStyle}>
          <Pressable
            onPress={onBackdropPress}
            style={{
              backgroundColor: "rgba(22, 24, 33, 0.6)",
              position: "absolute",
              bottom: 0,
              right: 0,
              left: 0,
              top: 0,
            }}
          />
          {Component as any}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalComponent;
