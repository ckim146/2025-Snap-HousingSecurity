import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { Card, FAB } from "@rn-vui/themed";

export default function EventInfo({ isVisible, event, onClose }) {
  if (!event || !isVisible) return null;

  let bitmoji =
    "https://img.wattpad.com/90a1809a942195f501ba5cafbf80161dd03ff822/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f38465370565a4e5263515a5278413d3d2d3530303538323139312e313466623164613439653163393466323134333730363231343331372e6a7067?s=fit&w=720&h=720";
  return (
    <View style={styles.EventInfo}>
      <Image
        style={{
          width: "100%",
          height: 100,
          objectFit: "contain",
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          objectFit: "cover",
        }}
        resizeMode="contain"
        source={{ uri: event.imageURL }}
      />
      <Text style={styles.titleText}>{event.title}</Text>
      <Text style={styles.descriptionText}>{event.description}</Text>
      <Text style={styles.timeText}>{event.time}</Text>
      <Text style={styles.locationText}>{event.location}</Text>
      <Text style={styles.locationText}>Interested in Attending?</Text>
      <FAB
        title="Yes"
        color="#FF3386"
        style={{ marginBottom: 10 }}
        onPress={() => console.log("Interested")}
      />
      <Text style={styles.peopleText}>People Attending</Text>

      <View style={styles.bitmojisContainer}>
        <Image style={styles.peopleBitmojis} source={{ uri: bitmoji }}></Image>
        <Image style={styles.peopleBitmojis} source={{ uri: bitmoji }}></Image>
        <Image style={styles.peopleBitmojis} source={{ uri: bitmoji }}></Image>
      </View>

      <FAB
        style={styles.closeIcon}
        onPress={onClose}
        color={"none"}
        icon={{ name: "close", color: "black" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  EventInfo: {
    backgroundColor: "white",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    borderColor: "yellow",
    width: "80%",
    position: "absolute",
    alignSelf: "center",
    top: "15%",
    borderRadius: 20,
    // padding: 20,
  },
  titleText: {
    color: "black",
    fontSize: 25,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  descriptionText: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 15,
  },
  timeText: {
    textAlign: "center",
  },
  locationText: {
    textAlign: "center",
    marginBottom: 15,
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  peopleBitmojis: {
    height: 40,
    width: 40,
    borderRadius: 100,
    objectFit: "cover",
    borderWidth: 1,
    borderColor: "grey",
  },
  bitmojisContainer: {
    marginTop: 10,
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 20,
  },
  peopleText: {
    marginLeft: 20,
  },
});
