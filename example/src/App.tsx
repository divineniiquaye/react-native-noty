import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

import { NotyPortal, Noty, PopOver } from "react-native-noty";
import { ExampleModal } from "./components/ExampleModal";
// import { NotyPortal, Noty } from "../../src/index";

export default function App() {
  const notyCount = React.useRef(0);
  const [tipMode, setTipMode] = React.useState(false);

  return (
    <React.Fragment>
      <NotyPortal />
      <SafeAreaView style={styles.container}>
        {tipMode ? (
          <View style={{ flex: 1 }}>
            {[
              {
                label: "top-left",
                position: { top: 30, left: 20 },
                interval: 2000,
                align: "left",
                title: "A simple popover",
                body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur pulvinar varius faucibus. Suspendisse faucibus urna a dolor dictum porta.",
              },
              {
                label: "top-right",
                align: "right",
                position: { top: 30, right: 20 },
                title: "Another simple popover",
                body: "It is useful to focus in some important functionality.",
              },
              {
                title: "A pressable tip",
                body: "I become pressable if you set an action for me using: onPress().",
                onPress: (t: any) => "default" === t && Noty.toast("Popover pressed!", "top"),
                position: { top: 300, left: 150 },
                label: "center",
                align: "center",
              },
              {
                label: "bottom-left",
                align: "left",
                position: { bottom: 20, left: 20 },
                title: "A tip calling another tip when pressed",
                body: "Press on me so a can call the TOP-LEFT tip.",
                onTipPress: () => Noty.popover("top-left"),
              },
              {
                label: "bottom-right",
                align: "right",
                position: { bottom: 20, right: 20 },
                title: "A tip firing a custom action when overlay pressed",
                body: "Press outside please.",
              },
            ].map((i, index) => (
              <PopOver
                key={i.label}
                id={i.label}
                content={{ title: i.title, body: i.body }}
                onDismiss={(d) => console.log("Result--", d)}
                interval={i?.interval}
                onPress={i?.onPress}
              >
                <View style={[styles.popOverContainer, i.position]}>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                      textTransform: "uppercase",
                    }}
                  >
                    {i.label}
                  </Text>
                </View>
              </PopOver>
            ))}

            <TouchableOpacity
              onPress={() =>
                Noty.popover([
                  "top-left",
                  "top-right",
                  "bottom-right",
                  "bottom-left",
                  "center",
                ])
              }
              style={{
                position: "absolute",
                bottom: 180,
                left: 20,
              }}
            >
              <Text
                style={{
                  padding: 4,
                  borderRadius: 5,
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "royalblue",
                  textTransform: "uppercase",
                }}
              >
                Start Tour
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTipMode(false)}
              style={{
                position: "absolute",
                bottom: 120,
                left: 20,
              }}
            >
              <Text
                style={{
                  padding: 4,
                  borderRadius: 5,
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "black",
                  textTransform: "uppercase",
                }}
              >
                Restart
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <React.Fragment>
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
              <Button
                title="Modal (Center)"
                onPress={async () => {
                  const result = await Noty.modal(ExampleModal);
                  console.log("Result--", result);
                }}
              />
              <Button
                title="Modal (Top or Bottom)"
                onPress={async () => {
                  notyCount.current++;
                  const result = await Noty.modal(
                    ExampleModal,
                    notyCount.current % 2 === 0 ? "top" : "bottom",
                  );
                  console.log("Result--", result);
                }}
              />
              <Button
                title="Toast (Center)"
                onPress={async () => {
                  notyCount.current++;
                  const result = await Noty.toast("Hello World Toast", {
                    type: notyCount.current % 2 === 0 ? "success" : "error",
                  });
                  console.log("Result--", result);
                }}
              />
              <Button
                title="Toast (Top or Bottom)"
                onPress={async () => {
                  notyCount.current++;
                  const result = await Noty.toast(
                    "Hello World Toast Example",
                    notyCount.current % 2 === 0 ? "top" : "bottom",
                  );
                  console.log("Result--", result);
                }}
              />
              <Button title="Popover (Tip)" onPress={() => setTipMode(true)} />
            </ScrollView>
          </React.Fragment>
        )}
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
  contentContainer: {
    paddingTop: 20,
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
  popOverContainer: {
    backgroundColor: "green",
    position: "absolute",
    borderRadius: 8,
    padding: 12,
  },
});
