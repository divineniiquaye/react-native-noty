import React from "react";
import {
  SafeAreaView as SafeAreaBase,
  StyleSheet,
  Dimensions,
  type ScaledSize,
  Platform,
  type ViewProps,
  View,
} from "react-native";

const isIOS10 =
  Platform.OS === "ios" &&
  Platform.Version?.toString()?.split(".")?.[0] === "10";

const s = StyleSheet.create({
  statusBarPadding: {
    paddingTop: 40,
  },
});

interface StatusBarSpacerState {
  displayPadding: boolean;
}

// This component used instead of SafeAreaView on iOS 10 because of bug & Android
class StatusBarSpacer extends React.Component<ViewProps, StatusBarSpacerState> {
  constructor(props: ViewProps) {
    super(props);

    const { height, width } = Dimensions.get("window");
    this.state = {
      displayPadding: height > width,
    };
    this.onSizeChange = this.onSizeChange.bind(this);
  }

  componentDidMount() {
    Dimensions.addEventListener("change", this.onSizeChange);
  }

  onSizeChange({ window }: { window: ScaledSize }) {
    this.setState({
      displayPadding: window.height > window.width,
    });
  }

  render() {
    const { style, ...props } = this.props;
    const { displayPadding } = this.state;
    return (
      <View style={[displayPadding && s.statusBarPadding, style]} {...props} />
    );
  }
}

const SafeAreaView = isIOS10 || Platform.OS === "android" ? StatusBarSpacer : SafeAreaBase;
export default SafeAreaView;
