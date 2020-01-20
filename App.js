import React from "react";
import { StyleSheet } from "react-native";
import TabNavigator from "./Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <TabNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5ff",
    alignItems: "center",
    justifyContent: "center"
  }
});
