import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CameraOptions({ flipCamera, switchFlash }) {
  const [flashState, setFlashState] = useState("flash-off-outline");
  const insets = useSafeAreaInsets();

  function switchFlash() {
    if (flashState == "flash-off-outline") {
      setFlashState("flash-outline");
    } else {
      setFlashState("flash-off-outline");
    }
  }

  return (
    <View style={[styles.cameraOptions, { marginTop: insets.top }]}>
      <TouchableOpacity onPress={flipCamera}>
        <Ionicons
          style={styles.flipIcon}
          name="repeat"
          size={30}
          color="white"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={switchFlash}>
        <Ionicons
          style={styles.flashIcon}
          name={flashState}
          size={30}
          color="white"
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons
          style={styles.videoIcon}
          name="videocam"
          size={30}
          color="white"
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons
          style={styles.musicIcon}
          name="musical-notes-outline"
          size={30}
          color="white"
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons
          style={styles.nightModeIcon}
          name="moon-outline"
          size={30}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraOptions: {
    position: "absolute",
    right: 12,
    paddingTop: 8,
    height: 250,
    width: 40,
    padding: 5,
  },
  flipIcon: {
    marginTop: 10,
    transform: [{ rotate: "90deg" }],
  },
  flashIcon: {
    marginTop: 20,
  },
  videoIcon: {
    marginTop: 20,
  },
  musicIcon: {
    marginTop: 20,
  },
  nightModeIcon: {
    marginTop: 20,
  },
});
