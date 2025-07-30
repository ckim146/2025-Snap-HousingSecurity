import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ReturnButton({ navigation, returnName }) {
  return (
    <View style={styles.returnBar}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate(returnName);
        }}
      >
        <Text style={styles.buttonText}>{"<"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  returnBar: {
    width: "100%",
    position: "absolute",
    top: 50,
  },
  button: {
    alignItems: "left",
    paddingLeft: 16,
    width: "100%",
  },
  buttonText: {
    color: "#2b83b3",
    fontSize: 28,
  },
});
