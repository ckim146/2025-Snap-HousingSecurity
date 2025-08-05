import React, { useEffect } from "react";
import { useState } from "react";

import { Card, FAB } from "@rn-vui/themed";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AddEvent from "../components/AddEvent";
import EventInfo from "../components/EventInfo";
import { supabase } from "../utils/hooks/supabase";
import orgIcon from "../../assets/Illuminati.png";
import IonIcon from "react-native-vector-icons/Ionicons";
import orgIcon2 from "../../assets/safe_place_for_youth_logo.jpeg";
import orgIcon3 from "../../assets/smc_logo.png";

export default function HomeBaseOnboardingScreen({ route, navigation }) {
  const [visible, setVisible] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  function toggleComponent() {
    setVisible(!visible);
    console.log(visible);
  }

  function handleCardTouch(event) {
    setDetailsVisible(true);
    console.log(detailsVisible);
    setSelectedEvent(event);
  }

  //Unccomment when organization table is created
  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from("organizations").select("*");
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setOrgs(data);

      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const refreshEvents = async () => {
    // await fetchData();
  };

    //we want to use this function to send information to Supabse when Submit button is clicked
  // function submitToSupabase(orgData) {

  //   let object = {
  //     id: btoa(title + time + new Date().toISOString()),
  //     user_id: 
  //   };
  //   return object;
  // }

    const insertData = async () => {
      if (title != "" && time != "" && location != "") {
        const eventData = submitToSupabase();
        console.log(eventData);
  
        onClose();
        try {
          const { data, error } = await supabase
            .from("event_table") //
            .insert([eventData]); // Insert the event data
  
          if (error) {
            console.error("Event already exists:", error);
          } else {
            console.log("Data inserted:", data);
          }
        } catch (error) {
          console.error("Unexpected error:", error);
        }
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.EventScreen}>
      <Text style={styles.mainHeader}>Community Suggestions</Text>
      <ScrollView>
        <View style={styles.Events}>
          {/* Mapping of organization cards from orgs state variable. */}
          {orgs.length > 0 ? (
            orgs.map((org, index) => {
              return (
              <TouchableOpacity
                key={org.id}
                style={styles.orgContainer}
                onPress={() => console.log("Pressed")}
              >
                <Image
                  source={{ uri: org.logo }}
                  style={{ width: "30%", height: 100, borderRadius: 10 }}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    marginLeft: 10,
                  }}
                >
                  <Text style={styles.title}>{org.name}</Text>
                  <Text style={styles.subtitle}>{org.description}</Text>
                </View>
                <View style={styles.plusButtonContainer}>
                  <IonIcon name="add-outline" size={30} color="black" />
                </View>
              </TouchableOpacity>
              );
            })
          ) : (
            <Text>Loading organizations...</Text>
          )}


          {/* {orgs.map((event) => ( // Uncomment when organization table is created
            <TouchableOpacity
              key={event.id}
              onPress={() => handleCardTouch(event)}
              style={styles.container}
            >
              <View style={styles.friends}>
                <Text style={styles.friendsText}>
                  {event.attending} friends going
                </Text>
              </View>
              <Image
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  borderRadius: 20,
                  objectFit: "cover",
                }}
                resizeMode="contain"
                source={{ uri: event.imageURL }}
              />
              <Card.Title style={styles.title}>{event.title}</Card.Title>
              <View style={styles.userInfo}>
                <Image
                  style={styles.bitmojiUser}
                  source={{
                    uri: "https://sdk.bitmoji.com/render/panel/20048676-103221902646_4-s5-v1.png?transparent=1&palette=1&scale=1",
                  }}
                />
                <Text style={styles.username}>{event.host}</Text>
              </View>
            </TouchableOpacity>
          ))} */}
        </View>
        <View style={styles.nextButton}>
          <Button
            title="Next"
            onPress={() => navigation.navigate("Homebase")}
          />
        </View>
      </ScrollView>
      <AddEvent
        isVisible={visible}
        onClose={() => {
          toggleComponent();
          refreshEvents();
        }}
      />
      <EventInfo
        isVisible={detailsVisible}
        event={selectedEvent}
        onClose={() => setDetailsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Events: {
    padding: 20,
    width: "100%",
    display: "flex",
    gap: 10,
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    width: "48%",
    backgroundColor: "#E5E5E5",
    display: "flex",
    justifyContent: "space-between",
    // alignItems:"center",
    padding: 10,
    // gap:10,
    borderRadius: 20,
    maxHeight: 250,
    margin: 0,
  },
  bitmojiUser: {
    width: 28,
    aspectRatio: 1,
    borderRadius: 1000,
    margin: 0,
  },
  title: {
    textAlign: "left",
    marginTop: 8,
    marginBottom: 5,
    fontSize: 15,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 5,
    fontSize: 13,
    color: "#575757",
    width: "60%",
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 0,
  },
  friends: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 100,
    backgroundColor: "#fffc00",
    margin: 0,
    borderRadius: 20,
    padding: 10,
  },
  friendsText: {
    fontWeight: "bold",
    fontSize: 10,
  },
  username: {
    fontSize: 11,
    margin: 0,
    fontWeight: "bold",
    color: "#575757",
  },
  addButton: {
    position: "absolute",
    bottom: 110,
    right: 30,
  },
  EventScreen: {
    height: "100%",
  },
  orgContainer: {
    width: "90%",
    height: 120,
    padding: 10,
    backgroundColor: "#ffffffff",
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    display: "flex",
    flexDirection: "row",
  },
  plusButtonContainer: {
    position: "absolute",
    right: 15,
    top: "60%",
    transform: [{ translateY: -15 }], // half of icon size to center vertically
  },
  mainHeader: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 40,
    marginTop: 10,
    marginBottom: 10,
  },
});
