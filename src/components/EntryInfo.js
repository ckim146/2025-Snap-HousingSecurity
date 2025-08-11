import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { Card, darkColors, FAB } from "@rn-vui/themed";
import Color from "color";
import IonIcon from "react-native-vector-icons/Ionicons";
import * as Location from "expo-location";
import { useNavigation } from '@react-navigation/native';

export default function EntryInfo({
  isVisible,
  event,
  onClose,
  typeColor,
  org,
}) {
  if (!event || !isVisible) return null;

  let lightColor = Color(typeColor).darken(0.15).rgb().string();
  let veryLightColor = Color(typeColor).lighten(0.1).rgb().string();
  let darkColor = Color(typeColor).darken(0.8).rgb().string();
  const [address, setAddress] = useState(null);
  const [location, setLocation] = useState("");
  const navigation = useNavigation();
  //changed

  let bitmoji =
    "https://img.wattpad.com/90a1809a942195f501ba5cafbf80161dd03ff822/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f38465370565a4e5263515a5278413d3d2d3530303538323139312e313466623164613439653163393466323134333730363231343331372e6a7067?s=fit&w=720&h=720";
  
    useEffect(() => {
    if (event.location) {
      setLocation(event.location);
    }

    const getAddress = async () => {
      const coords = event.location;
      if (
        !coords ||
        typeof coords.latitude !== "number" ||
        typeof coords.longitude !== "number"
      ) {
        return;
      }
      try {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        if (geocode.length > 0) {
          const { street, city, region } = geocode[0];
          setAddress(`${street}, ${city}, ${region}`);
        }
      } catch (err) {
        console.error("Failed to reverse geocode:", err);
      }
    };

    getAddress();

    
  }, [event.location]);
  
    return (
    <View style={[styles.EventInfo, { backgroundColor: typeColor }]}>
      <View
        style={{
          backgroundColor: lightColor,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingLeft: 30,
          justifyContent: "space-evenly",
          flexDirection: "column",
          height: 100,
        }}
      >
        <Text style={[styles.titleText, { color: darkColor }]}>
          {event.title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: "50%",
            justifyContent: "space-between",
          }}
        >
          <Text style={[{ color: darkColor }]}>{event.date}</Text>
          <Text style={{ color: lightColor }}>{event.time}</Text>
        </View>
        <Text>Hosted by {org}</Text>
      </View>
      <View
        style={[
          styles.infoBody,
          { flexDirection: "column", alignItems: "flex-start" },
        ]}
      >
        <Text style={[styles.titleText, { fontSize: 18, color: darkColor }]}>
          About This Event
        </Text>
        <Text style={[styles.descriptionText, { textAlign: "left" }]}>
          {event.description}
        </Text>
        <Text style={[styles.titleText, { fontSize: 18, color: darkColor }]}>
          Location
        </Text>
        <TouchableOpacity 
        onPress={() => navigation.navigate("UserTab", { screen: "Map", params: { coordinates: {latitude: event.location.latitude, longitude: event.location.longitude } } })}>
        <Text style={styles.locationText}>{address}</Text>
        </TouchableOpacity>
        <FAB
          title="Get Directions"
          color={veryLightColor}
          style={{ marginBottom: 0, marginRight: 6 }}
          titleStyle={[
            styles.descriptionText,
            {
              color: darkColor,
              fontSize: 14,
              textAlignVertical: "center", // vertical alignment
              lineHeight: 35, // fine-tune if still off
            },
          ]}
          buttonStyle={{
            paddingHorizontal: 12, // enough space for text
            paddingVertical: 0, // small height
            height: 40, // total button height
            minWidth: 0, // prevent default large width
            borderRadius: 6, // keep corners from cutting text
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => console.log("Interested")}
        />
      </View>
      {/* <Text style={styles.locationText}>Interested in Attending?</Text> */}

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
    zIndex: 3,
    // padding: 20,
  },
  titleText: {
    color: "black",
    fontSize: 20,
    textAlign: "left",
    // marginBottom: 10,
    // marginTop: 10,
    // marginLeft: 30,
    fontWeight: "bold",
  },
  descriptionText: {
    textAlign: "left",
    marginBottom: 15,
    fontSize: 15,
  },
  timeText: {
    textAlign: "center",
  },
  locationText: {
    textAlign: "center",
    marginBottom: 5,
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
  infoBody: {
    paddingHorizontal: 30,
    flexDirection: "column",
    justifyContent: "space-evenly",
    height: 300,
    width: "100%"
  },
});
