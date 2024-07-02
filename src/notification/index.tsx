import { Image, type ImageProps, StyleSheet, Text, View } from "react-native";
import React from "react";

export type NotificationViewProps = {
  title?: string;
  message?: string;
  image?: ImageProps["source"];

  style?: View["props"]["style"];
  titleProps?: Text["props"];
  messageProps?: Text["props"];
  imageProps?: Omit<ImageProps, "source">;
};

export const Notification: React.FC<NotificationViewProps> = (props) => {
  const { style: imageStyle, ...imageProps } = props?.imageProps ?? {
    style: styles.image,
  };
  const { style: titleStyle, ...titleTextProps } = props?.titleProps ?? {
    style: styles.title,
  };
  const { style: messageStyle, ...messageTextProps } = props?.messageProps ?? {
    style: styles.message,
  };

  return (
    <View style={[styles.container, props?.style]}>
      {props?.image && (
        <Image source={props.image} style={imageStyle} {...imageProps} />
      )}
      {props?.title && (
        <Text
          style={titleStyle}
          numberOfLines={1}
          {...titleTextProps}
          children={props.title}
        />
      )}
      {props?.message && (
        <Text
          style={messageStyle}
          numberOfLines={3}
          {...messageTextProps}
          children={props.message}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 36,
    width: 36,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "white",
  },
});
