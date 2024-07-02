import React from "react";

import type { NotificationProps } from "./notification/types";
import type { NotificationViewProps } from "./notification";
import type { ModalProps } from "./modal/types";
import type { ToastProps } from "./toast/types";
import type { PopOverProps } from "./popover";

type NotyComponents =
  | { type: "notification"; props?: NotificationProps }
  | { type: "modal"; props?: ModalProps }
  | { type: "toast"; props?: ToastProps };

export type ConfigProps = NotyComponents & {
  /** How fast notification will appear/disappear
   * @default 4000 */
  interval?: number;
};

/** Same as NodeJS.Timeout to avoid build errors */
export type Timeout = ReturnType<typeof setTimeout> | null;

const getNotyRef = (): NonNullable<typeof Noty.ref.current> => {
  if (!Noty.ref.current) {
    throw new Error(
      "NotyPortal not found. Please wrap your component with NotyPortal",
    );
  }

  return Noty.ref.current;
};

/**
 * @description Shows a modal. If a modal is already present, it will be closed before displaying the new one.
 * @param component A function that returns a {@link React.FC} to be shown.
 * @param config Optional configuration object to override the default values.
 * @returns A Promise that resolves with the props passed to {@link hide} when the modal is closed.
 */
const show = async <T = any>(
  component: React.FC,
  config?: ConfigProps | NotyComponents["type"],
): Promise<T> => getNotyRef().show<any>?.(component, config);

/**
 * @description A modal for displaying notifications (top or bottom).
 * @param component A function that returns a {@link React.FC} to be shown.
 * @param config Optional configuration object to override the default values.
 * @returns  A Promise that resolves with the props passed to {@link hide} when the modal is closed.
 */
const notification = async <T = any>(
  component: React.FC | NotificationViewProps,
  config?: Omit<ConfigProps, "type" | "props"> & NotificationProps,
): Promise<T> => getNotyRef().notification<any>?.(component, config);

/**
 * @description A modal for displaying notifications (top, center or bottom).
 * @param component A function that returns a {@link React.FC} or {@link React.ReactNode} to be shown.
 * @param config Optional configuration object to override the default values.
 * @returns  A Promise that resolves with the props passed to {@link hide} when the modal is closed.
 */
const modal = async <T = any>(
  component: React.FC | React.ReactNode,
  config?: ModalProps | "top" | "center" | "bottom",
): Promise<T> => getNotyRef().modal<any>?.(component, config);

/**
 * @description A modal for displaying toast (top, center or bottom).
 * @param component A function that returns a {@link React.FC} or string to be shown.
 * @param config Optional configuration object to override the default values.
 * @returns  A Promise that resolves with the props passed to {@link hide} when the modal is closed.
 */
const toast = async <T = any>(
  component: React.FC | string,
  config?: ToastProps | "top" | "center" | "bottom",
): Promise<T> => getNotyRef().toast<any>?.(component, config);

const popover = async <T = any>(
  id: string | string[],
  config?: Omit<PopOverProps, "id" | "active" | "onShown" | "children">,
): Promise<T> => getNotyRef().popover<any>?.(id, config);

/**
 * @description Hide the current modal.
 * @param props Those props will be passed to the {@link show} resolve function.
 * @returns {Promise<void>} Returns a promise that resolves when the close animation is finished.
 */
const hide = async <T = any>(props?: T): Promise<void> =>
  getNotyRef().hide?.(props);

/**
 * @description Creates a promise that resolves after a given amount of time has passed.
 * @param ms The amount of milliseconds to wait before resolving the promise.
 * @returns A promise that resolves after the given amount of time has passed.
 */
export const timeout = (ms: number, ref: React.MutableRefObject<Timeout>) =>
  new Promise(
    (resolve) =>
      (ref.current = setTimeout(() => {
        resolve(ms);
        ref.current = null;
      }, ms)),
  );

export interface IModal {
  notification: typeof notification;
  popover: typeof popover;
  modal: typeof modal;
  toast: typeof toast;
  show: typeof show;
  hide: typeof hide;
}

/**
 * @example
 * ```js
 * // ...
 * import { Noty } from 'react-native-noty';
 *
 * // ...
 * const ExampleModal = () => (
 *  <TouchableOpacity onPress={() => Noty.hide("hey")}>
 *    <Text>Test!</Text>
 *  </TouchableOpacity>
 * )
 *
 * const result = await Noty.show(ExampleModal);
 * console.log(result); // Returns 'hey' when the modal is closed by the TouchableOpacity.
 * ```
 */
export const Noty = {
  ref: { current: null } as React.RefObject<IModal>,
  show,
  modal,
  toast,
  popover,
  notification,
  hide,
};
