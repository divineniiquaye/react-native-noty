import type { ModalProps as BaseProps } from "react-native";

export type ModalProps = Omit<BaseProps, "requestClose" | "visible"> & {
  position?: "top" | "center" | "bottom";
};
