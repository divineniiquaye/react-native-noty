import { ModalProps } from "react-native";
import React from "react";

import type { NotificationProps } from "./notification/types";

type NotyComponents =
  | { type: "notification"; props?: NotificationProps }
  | { type: "modal"; props?: Partial<ModalProps> };

export type ConfigProps = NotyComponents & {
  /** How fast notification will appear/disappear
   * @default 4000 */
  interval?: number;
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
): Promise<T> => notyModalRef.current?.show<any>?.(component, config);

/**
 * @description A modal for displaying notifications (top or bottom).
 * @param component A function that returns a {@link React.FC} to be shown.
 * @param config Optional configuration object to override the default values.
 * @returns  A Promise that resolves with the props passed to {@link hide} when the modal is closed.
 */
const notification = async <T = any>(
  component: React.FC,
  config?: Omit<ConfigProps, "type" | "props"> & NotificationProps,
): Promise<T> => notyModalRef.current?.notification<any>?.(component, config);

/**
 * @description Hide the current modal.
 * @param props Those props will be passed to the {@link show} resolve function.
 * @returns {Promise<void>} Returns a promise that resolves when the close animation is finished.
 */
const hide = async <T = any>(props?: T): Promise<void> =>
  notyModalRef.current?.hide?.(props);

/**
 * @description Creates a promise that resolves after a given amount of time has passed.
 * @param ms The amount of milliseconds to wait before resolving the promise.
 * @returns A promise that resolves after the given amount of time has passed.
 */
export const timeout = (
  ms: number,
  ref: React.MutableRefObject<NodeJS.Timeout | null>,
) =>
  new Promise(
    (resolve) =>
      (ref.current = setTimeout(() => {
        resolve(ms);
        ref.current = null;
      }, ms)),
  );

export interface IModal {
  notification: typeof notification;
  show: typeof show;
  hide: typeof hide;
}

export const notyModalRef = React.createRef<IModal>();

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
  show,
  notification,
  hide,
};
