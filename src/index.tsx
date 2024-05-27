import { Text } from "react-native";
import React from "react";

import { DEFAULT_DURATION, HideTypes } from "./constants";
import NotificationComponent from "./notification/component";
import PopOverComponent from "./popover/component";
import { Notification } from "./notification";
import ModalComponent from "./modal/component";
import ToastComponent from "./toast/component";
import {
  type ConfigProps,
  type IModal,
  type Timeout,
  notyModalRef,
  timeout,
} from "./handler";

export { PopOver } from "./popover";
export { Notification } from "./notification";
export { Noty, type ConfigProps } from "./handler";

type GenericFunction = (props: any) => any;

/**
 * @description A portal that should stay on the top of the app component hierarchy for the modal to be displayed.
 * @example
 * ```js
 * import { NotyPortal } from 'react-native-noty';
 *
 * export default function App() {
 *   return (
 *     <SomeRandomProvider>
 *       <NotyPortal />  // <-- On the top of the app component hierarchy
 *       <Router /> // Your app router or something could follow below
 *     </SomeRandomProvider>
 *   );
 * }
 * ```
 */
export const NotyPortal: React.FC = () => {
  const [content, setContent] = React.useState<React.FC>(() => <></>);
  const [isVisible, setIsVisible] = React.useState<0 | 1 | 2>(0);
  const [config, setConfig] = React.useState<ConfigProps>();
  const popOverRef = React.useRef<Record<string, any>>({});

  const timeoutRef = React.useRef<Timeout>(null);
  const onHideRef = React.useRef<GenericFunction>(() => {});
  const hide = React.useCallback<IModal["hide"]>(
    async (props) => {
      if (HideTypes.MODAL_OVERRIDE === props) {
        setIsVisible(2);
        await timeout(60, timeoutRef);
      } else setIsVisible(2);

      onHideRef.current(props);
    },
    [config?.interval],
  );

  const show = React.useCallback<IModal["show"]>(
    async (component, config: any = "modal") => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (typeof config === "string") config = { type: config };
      if (1 === isVisible) await hide(HideTypes.MODAL_OVERRIDE);

      React.startTransition(() => {
        setConfig(config as any);
        setContent(component);
        setIsVisible(1);
      });

      return new Promise((resolve) => {
        onHideRef.current = resolve;
      });
    },
    [isVisible],
  );

  React.useImperativeHandle(notyModalRef, () => ({
    hide,
    show,
    toast: (component, config) =>
      show(
        typeof component === "function"
          ? component
          : () => (
              <Text
                style={{ fontSize: 14, textAlign: "center", color: "white" }}
                children={component}
                numberOfLines={3}
              />
            ),
        typeof config === "string"
          ? { type: "toast", props: { position: config } }
          : {
              interval: config?.interval ?? DEFAULT_DURATION,
              type: "toast",
              props: config,
            },
      ),
    modal: (component, config) =>
      show(typeof component === "function" ? component : () => component, {
        type: "modal",
        props: typeof config === "string" ? { position: config } : config,
      }),
    notification: (component, config) =>
      show(
        typeof component === "function"
          ? component
          : () => <Notification {...component} />,
        {
          interval: config?.interval ?? DEFAULT_DURATION,
          type: "notification",
          props: config,
        },
      ),
    popover: async (id, config) => {
      if (config) {
        if (Array.isArray(id)) {
          throw new Error("Registering an array of ids is not supported");
        }

        popOverRef.current[id] = config;
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (1 === isVisible) await hide(HideTypes.MODAL_OVERRIDE);

        React.startTransition(() => {
          if (typeof id === "string" && popOverRef.current[id]) {
            setConfig([{ id, ...popOverRef.current[id] }] as any);
          } else {
            const popovers = Object.entries(popOverRef.current);
            setConfig(
              popovers
                .filter(([k]) => id.includes(k))
                .map(([k, v]) => ({ id: k, ...v })) as any,
            );
          }

          setIsVisible(1);
        });
      }

      return new Promise((resolve) => {
        onHideRef.current = resolve;
      });
    },
  }));

  if ("notification" === config?.type) {
    return (
      <NotificationComponent
        interval={config.interval ?? DEFAULT_DURATION}
        setVisible={setIsVisible}
        visible={isVisible}
        content={content}
        dismiss={hide}
        ref={timeoutRef}
        {...config.props}
      />
    );
  }

  if ("toast" === config?.type) {
    return (
      <ToastComponent
        interval={config.interval ?? DEFAULT_DURATION}
        setVisible={setIsVisible}
        visible={isVisible}
        content={content}
        dismiss={hide}
        ref={timeoutRef}
        {...config.props}
      />
    );
  }

  if ("modal" === config?.type) {
    return (
      <ModalComponent
        onBackButtonPress={() => {
          hide(HideTypes.BACK_BUTTON_PRESSED);
          return true;
        }}
        onBackdropPress={() => hide(HideTypes.BACKDROP_PRESSED)}
        visible={isVisible}
        content={content}
        {...config.props}
      />
    );
  }

  if (Array.isArray(config)) {
    return (
      <PopOverComponent
        config={config as any}
        visible={isVisible}
        dismiss={hide}
        ref={timeoutRef}
      />
    );
  }

  return <></>;
};
