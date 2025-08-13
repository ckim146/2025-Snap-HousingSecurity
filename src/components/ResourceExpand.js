import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Card, darkColors, FAB } from "@rn-vui/themed";
import Color from "color";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, Modal } from "react-native";
import EntryInfo from "./EntryInfo";
import * as Location from "expo-location";

export default function ResourceExpand({
  isVisible,
  cardData,
  typeColor,
  event,
}) {
  // if (!isVisible) return null;

  let lightColor = Color(typeColor).darken(0.15).rgb().string();
  let veryLightColor = Color(typeColor).lighten(0.1).rgb().string();
  let subDarkColor = Color(typeColor).darken(0.6).rgb().string();
  let darkColor = Color(typeColor).darken(0.8).rgb().string();
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [address, setAddress] = useState(null)
  const navigation = useNavigation();

  function handleCardTouch(event) {
    setDetailsVisible(true);
    setSelectedEvent(event);
  }

      useEffect(() => {

      const getAddress = async () => {
        const coords = cardData.location;
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
            setAddress(`${city}, ${region}`);
          }
        } catch (err) {
          console.error("Failed to reverse geocode:", err);
        }
      };
  
      getAddress();
  
      
    }, [cardData.location]);

  return (
    <>
      <View
        key={cardData.id}
        style={[
          styles.EventInfo,
          { backgroundColor: typeColor, width: "100%" },
        ]}
      >
        <View
          style={[
            styles.infoBody,
            { flexDirection: "column", alignItems: "flex-start", flex: 1 },
          ]}
        >
          <Text style={[styles.titleText, { color: darkColor }]}>
            {cardData.title}
          </Text>
          <Text style={[styles.titleText, { color: subDarkColor }]}>
            {cardData.date} • {cardData.time}
          </Text>
          <Text
            style={[styles.descriptionText, { textAlign: "left" }]}
            numberOfLines={2} // Limits text to 3 lines
            ellipsizeMode="tail"
          >
            {cardData.description}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <IonIcon name="location-sharp" size={18} />
            <Text
              style={[styles.locationText, { color: darkColor, marginLeft: 5 }]}
            >
              {address}
            </Text>
            <Pressable
              style={styles.nextButton}
              onPress={() => handleCardTouch(cardData)}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  color: subDarkColor,
                }}
              >
                Learn More
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Put modal OUTSIDE of map */}
      {detailsVisible && (
        <Modal
          transparent
          visible={detailsVisible}
          animationType="fade"
          onRequestClose={() => setDetailsVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setDetailsVisible(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>

          <View
            style={{
              position: "absolute",
              top: 150,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <EntryInfo
              isVisible={detailsVisible}
              event={selectedEvent}
              typeColor={typeColor}
              org="Youth Forward"
              onClose={() => setDetailsVisible(false)}
            />
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  EventInfo: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    borderColor: "yellow",
    width: "95%",
    position: "absolute",
    alignSelf: "center",
    // top: "15%",
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
    textAlign: "left",
    fontSize: 15,
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
    paddingVertical: 10,
    flexDirection: "column",
    justifyContent: "space-evenly",
    height: 150,
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills entire screen
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black
  },
  nextButton: {
    borderRadius: 100,
    backgroundColor: "#ffffff",
    width: 120,
    marginLeft: "auto",
    padding: 5,
    alignItems: "center",
  },
});
