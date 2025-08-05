import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MapInsideHomeBase({ route }) {
  const { resource } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Other Info</Text>
      <Text>{resource?.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
