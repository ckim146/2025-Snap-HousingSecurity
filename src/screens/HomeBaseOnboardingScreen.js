import React, { use, useEffect } from "react";
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
import { useAuthentication } from "../utils/hooks/useAuthentication";
import Swiper from "react-native-deck-swiper";

export default function HomeBaseOnboardingScreen({ route, navigation }) {
  const [visible, setVisible] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useAuthentication();
  // const [visibleOrgs, setVisibleOrgs] = useState([]);
  const [userInput, setUserInput] = useState("");
  // const [orgContainerVisible, setOrgContainerVisible] = useState(false);
  // const [isSorting, setIsSorting] = useState(true);
  const [orgState, setOrgState] = useState({
    visibleOrgs: [],
    sortedOrgs: [],
    isSorting: true,
    orgContainerVisible: false,
  });

  const cardData = [
    { id: 1, title: "Card 1", content: "First card content" },
    { id: 2, title: "Card 2", content: "Second card content" },
    { id: 3, title: "Card 3", content: "Third card content" },
  ];
  const [cards, setCards] = useState(cardData);

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
        setOrgState((prevState) => ({
          ...prevState,
          visibleOrgs: data.slice(0, 3),
          sortedOrgs: data,
        })); // Display only the first 3 organizations
      }
      console.log(
        "Fetched org names:",
        data.map((org) => org.name)
      );
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  //Use OpenAI to sort the list of organizations by relevance to the user
  const sortOrgsByRelevance = async (userInput, orgs) => {
    const prompt = `A user wrote this about themselves: "${userInput}".You are given this list of organizations:
${orgs.map((org, i) => `${i + 1}. ${org.name} - ${org.description}`).join("\n")}
Sort these organizations from most to least relevant for the user based on their interests.
Return ONLY a JSON array of the organization names in the sorted order, like:
["Org Name 1", "Org Name 2", ...]`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_SENSITIVE_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const json = await response.json();
    const resultText = json.choices?.[0]?.message?.content;

    // Map sorted names back to the full org objects
    const nameToOrgMap = {};
    orgs.forEach((org) => {
      nameToOrgMap[org.name] = org;
    });

    //Use mapped names to create a sorted array of org objects
    const sortedOrgs = JSON.parse(resultText)
      .map((name) => nameToOrgMap[name])
      .filter(Boolean); // Removes any unmatched names

    console.log("Sorted orgs:", sortedOrgs);
    setOrgState((prev) => ({
      ...prev,
      visibleOrgs: sortedOrgs.slice(0, 3), // Show only the first 3 sorted organizations
      isSorting: false,
      sortedOrgs: sortedOrgs,
      orgContainerVisible: true,
    }));
  };

  /*When a organization card is pressed, this function will submit the org assignment to Supabase. Constraint set on Supabase table
to prevent duplicate entries, so this will only work if the user has not already joined the organization.*/
  const submitToSupabase = async (orgData) => {
    let newUserOrgAssignment = {
      user_id: user.id,
      org_id: orgData.id,
    };
    try {
      console.log(
        "Submitting org assignment to Supabase:",
        newUserOrgAssignment
      );
      const { data, error } = await supabase
        .from("org_user_assignments") //
        .insert([newUserOrgAssignment]); // Insert the org assignment data

      if (error) {
        console.error("org assignment already exists:", error);
      } else {
        console.log("Data inserted:", data); //Will log "null" even when it is successful. Needs a select query to return the inserted data
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
    // Remove clicked org from the queue
    const updatedAll = orgState.sortedOrgs.filter(
      (org) => org.id !== orgData.id
    );
    const newVisible = updatedAll.slice(0, 3);
    // setOrgs(updatedAll);
    setOrgState((prevState) => ({
      ...prevState,
      sortedOrgs: updatedAll,
      visibleOrgs: newVisible,
    }));
  };

  /* This fetch is to be used for the main home base screen to retireve org events. Move after merging */
  const fetchCorkboardEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("corkboard_entries")
        .select("*")
        .eq("org_id", orgState.sortedOrgs[0].id); // Fetch events for the first organization as an example
      // .eq("type", "food"); // Example filter for type, can be adjusted as needed
      if (error) {
        console.error("Error fetching events:", error);
      } else {
        console.log("Fetched events for org:", orgState.sortedOrgs[0].id);
        console.log("Fetched events:", data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  /* Fetches an unsorted list of all organizations available when the screen is initially loaded */

  const fetchUserOrgs = async () => {
    try {
      const { data, error } = await supabase
        .from("org_user_assignments")
        .select(`org_id, organizations(name)`)
        .eq("user_id", user.id);
      if (error) {
        console.error("Error fetching user's orgs:", error);
      } else {
        console.log("User's id:", user.id);
        console.log("User's orgs:", data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const refreshEvents = async () => {
    // await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.EventScreen}>
      <Text style={styles.mainHeader}>Welcome to</Text>
      <Text style={[styles.mainHeader, { fontSize: 32, marginTop: 0 }]}>
        Home Base
      </Text>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Describe your interests or needs"
        />
        <IonIcon
          name="search"
          size={20}
          color="#7a5728"
          style={{ position: "absolute", left: 15 }}
        />
      </View>
      <View style={styles.findButton}>
        <Button
          title="Find Communities"
          onPress={() => sortOrgsByRelevance(userInput, orgs)}
          color={"#f5d4a9"}
        />
      </View>
              <View style={styles.cardContainer}>
        <Swiper
          cards={cards}
          renderCard={(card) => (
            <View style={styles.card}>
              <Text style={styles.title}>{card.title}</Text>
              <Text>{card.content}</Text>
            </View>
          )}
          onSwiped={() => console.log("swiped")}
          cardIndex={0}
          backgroundColor={"#f0f0f0"}
          stackSize={3}
          stackSeparation={15}
          animateCardOpacity
          // disableBottomSwipe
          // disableTopSwipe
        />
         </View>
      <ScrollView>
        <View style={[styles.Events, { display: true ? "flex" : "none" }]}>
          {/* Mapping of organization cards from orgs state variable. */}
          {
            /*!orgState.isSorting*/ true ? (
              orgState.visibleOrgs.length > 0 ? (
                orgState.visibleOrgs.map((org, index) => (
                  <TouchableOpacity
                    key={org.id}
                    style={styles.orgContainer}
                    onPress={() => submitToSupabase(org)}
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
                ))
              ) : (
                <Text>Loading organizations...</Text>
              )
            ) : null
          }

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
            color={"#f5d4a9"}
          />
        </View>
        {/* <View style={styles.nextButton}>
          <Button
            title="Log org entries for first org"
            onPress={() => fetchCorkboardEntries()}
          />
        </View> */}

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
    backgroundColor: "#a67637",
  },
  orgContainer: {
    width: "90%",
    height: 120,
    padding: 10,
    backgroundColor: "#f5d4a9",
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#473927",
    marginTop: 10,
    marginBottom: 0,
  },
  searchInput: {
    // margin: 20,
    borderWidth: 0,
    borderRadius: 100,
    padding: 10,
    backgroundColor: "#f5d4a9",
    width: "100%",
    paddingLeft: 45,
  },
  nextButton: {
    borderRadius: 100,
    backgroundColor: "#7a5728",
    width: 120,
    alignSelf: "center",
    padding: 5,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: 350,
    marginTop: 10,
  },
  findButton: {
    borderRadius: 100,
    backgroundColor: "#7a5728",
    width: 200,
    alignSelf: "center",
    padding: 5,
    marginTop: 15,
  },
  card: {
    height: 100,
    width: 100,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
    cardContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
