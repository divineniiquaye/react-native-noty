import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";

import { NotyPortal, Noty } from "react-native-noty";
// import { NotyPortal, Noty } from "../../src/index";

export default function App() {
  const notyCount = React.useRef(0);

  return (
    <React.Fragment>
      <NotyPortal />
      <SafeAreaView style={styles.container}>
        <View style={styles.closeContainer}>
          <Button title="Close!" onPress={() => Noty.hide("hey")} />
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.textTitle}>Noty Example</Text>
          <Button
            title="Notification (Top)"
            onPress={async () => {
              notyCount.current++;
              const result = await Noty.notification(
                { message: `Hello World ${notyCount.current}` },
                { type: notyCount.current % 2 === 0 ? "success" : "error" },
              );
              console.log("Result--", result);
            }}
          />
          <Button
            title="Notification (Botton)"
            onPress={async () => {
              notyCount.current++;
              const result = await Noty.notification(
                { message: `Hello World ${notyCount.current}` },
                {
                  type: notyCount.current % 2 === 0 ? "success" : "error",
                  position: "bottom",
                },
              );
              console.log("Result--", result);
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 16,
    flex: 1,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  contentContainer: {
    paddingTop: 20,
    // paddingVertical: 50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 25,
    maxHeight: 500,
    paddingHorizontal: 30,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  closeContainer: {
    alignSelf: "flex-start",
    marginLeft: 16,
    marginTop: 50,
  },
});
