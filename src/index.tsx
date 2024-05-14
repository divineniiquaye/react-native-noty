import React from "react";

import { ConfigProps, IModal, notyModalRef, timeout } from "./handler";
import NotificationComponent from "./notification/component";
import { DEFAULT_DURATION, HideTypes } from "./constants";

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

  const onHideRef = React.useRef<GenericFunction>(() => { });
  const hide = React.useCallback<IModal["hide"]>(
    async (props) => {
      if (HideTypes.MODAL_OVERRIDE === props) {
        setIsVisible(2);
        await timeout(60);
      } else setIsVisible(2);

      setTimeout(() => { }, config?.interval ?? DEFAULT_DURATION);
      onHideRef.current(props);
    },
    [config?.interval],
  );

  const show = React.useCallback<IModal["show"]>(
    async (component, config: any = "modal") => {
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
    }, [isVisible]);

  React.useImperativeHandle(notyModalRef, () => ({
    hide,
    show,
    notification: (component, config) => {
      return show(component, {
        interval: config?.interval ?? DEFAULT_DURATION,
        type: "notification",
        props: config,
      });
    }
  }));

  if ("notification" === config?.type) {
    return (
      <NotificationComponent
        interval={config.interval ?? DEFAULT_DURATION}
        setVisible={setIsVisible}
        visible={isVisible}
        content={content}
        dismiss={hide}
        {...config.props}
      />
    );
  }

  return <></>;
};
