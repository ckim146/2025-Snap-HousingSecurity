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
import {NavigationContainer} from '@react-navigation/native';

export default function HomeBaseScreen({ route, navigation }) {
  const [visible, setVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
//selected 
  const [selected, setSelected] = useState([]);

const cards = [
    { id: 1, name: "Safe Place for Youth (SPY)" },
    { id: 2, name: "Venice Community Housing" },
    { id: 3, name: "Food Pantry Nearby" },
  ];

  function toggleComponent() {
    setVisible(!visible);
    console.log(visible);
  }

  function handleCardTouch(event) {
    setDetailsVisible(true);
    console.log(detailsVisible);
    setSelectedEvent(event);
  }

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    navigation.navigate("HomeBaseMainPage", {
      selectedCards: cards.filter((card) => selected.includes(card.id)),
    });
  };


  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from("event_table").select("*");
      if (error) {
        //console.error("Error fetching data:", error);
      } else {
        setEvents(data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const refreshEvents = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.EventScreen}>
      <Text style={styles.header}>Choose your resources</Text>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => toggleSelect(card.id)}
            style={[
              styles.homebaseCard,
              selected.includes(card.id) && styles.selectedCard,
            ]}
          >
            <Text style={styles.cardText}>{card.name}</Text>
          </TouchableOpacity>
        ))}
      
      {/* <View style={styles.homebaseCard}>
        <Text style={styles.header}>Safe Place for Youth (SPY) </Text>
        <Button
        onPress={() => {
          navigation.navigate("Organization");
        }}
        title="Homebase"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
        </View> */}
              </ScrollView>

<View style={styles.submitButton}>
        <Button title="Submit" onPress={handleSubmit} disabled={selected.length === 0} />
      </View>

        
      
      <ScrollView>
        <View style={styles.Events}>
          {/* {events.map((event) => (
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
      </ScrollView>


      
      <FAB
        onPress={toggleComponent}
        style={styles.addButton}
        visible={true}
        icon={{ name: "add", color: "white" }}
        color="#334effff"
      />
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  cardContainer: {
  paddingHorizontal: 20,
  paddingBottom: 20,
  gap: 20,
},
  homebaseCard: {
  backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
 selectedCard: {
    backgroundColor: "#d0e8ff",
    borderWidth: 2,
    borderColor: "#007bff",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 30,
    marginBottom: 40,
  },


});
