import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import Root from "./src/Root";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Root />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
