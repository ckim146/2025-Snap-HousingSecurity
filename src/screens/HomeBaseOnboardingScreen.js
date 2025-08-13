import React, { use, useEffect, useCallback } from "react";
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
import { Pressable, ScrollView } from "react-native-gesture-handler";
import AddEvent from "../components/AddEvent";
import EventInfo from "../components/EventInfo";
import { supabase } from "../utils/hooks/supabase";
import orgIcon from "../../assets/Illuminati.png";
import IonIcon from "react-native-vector-icons/Ionicons";
import orgIcon2 from "../../assets/safe_place_for_youth_logo.jpeg";
import orgIcon3 from "../../assets/smc_logo.png";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import Swiper from "react-native-deck-swiper";
import cardProfilePic from "../../assets/cardProfilePic.png";
import Color from "color";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import EntryInfo from "../components/EntryInfo";
import welcome_to_homebase_illustration from "../../assets/Welcome_to_homebase_illustration.png";

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
  //put into card copmponent
  const [cards, setCards] = useState(orgCardData);
  const [cardIndex, setCardIndex] = useState(0);
  const darkColor = "#62411b";

  //Adjust so that it populates with supdabase data. Pass to card component
  const orgCardData = [
    {
      id: 1,
      title: "Free Haircuts",
      age: "30 mins",
      date: "Mon, 8/18",
      time: "3-4pm",
      type: "ETC",
      description:
        "Learn to create a standout resume in Figma, highlight your skills, and format for clarity. Hosted by Jordan Lee, Career Coach at Youth Forward, who will share insider tips and answer your questions.",
      location: { latitude: 37.7689, longitude: -122.4149 },
    },
    {
      id: 2,
      title: "Resume Workshop",
      age: "1 hour",
      date: "Wed, 8/20",
      time: "12-1pm",
      type: "Skills",
    },
    {
      id: 3,
      title: "Mural Painting @ Campus",
      age: "13 mins",
      date: "Tues, 8/19",
      time: "10-4pm",
      type: "Social",
    },
    {
      id: 4,
      title: "New book vouchers ready in the office for students",
      age: "4 mins",
      type: "Tips",
      user: "Ben",
      profilePic: cardProfilePic,
    },
  ];

  //Put into card component later
  const colorCategoryMap = {
    Skills: "rgb(255, 211, 216)",
    ETC: "rgb(203, 249, 228)",
    Tips: "rgb(255, 226, 186)",
    Social: "rgb(235, 215, 254)",
  };
  function toggleEntryInfoVisible() {
    setDetailsVisible(true);
    // console.log(detailsVisible);
  }

  //Card tap handler
  const handleTap = useCallback(() => {
    console.log("Card tapped");
    toggleEntryInfoVisible();
  }, []);

  // Tap gesture — only fires when there's no drag movement
  const tapGesture = Gesture.Tap()
    // .maxDuration(250)
    // .maxDeltaX(5) // ignore if moved horizontally
    // .maxDeltaY(5) // ignore if moved vertically
    .onEnd((_, success) => {
      if (success) {
        handleTap();
      }
    });

  const panGesture = Gesture.Pan();

  const combinedGesture = Gesture.Simultaneous(tapGesture, panGesture);

  function handleCardTouch(event) {
    setDetailsVisible(true);
    // console.log(detailsVisible);
    setSelectedEvent(event);
  }

  //Initially fetch unorganized set of orgs
  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from("organizations").select("*");
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setOrgs(data);
        setOrgState((prevState) => ({
          ...prevState,
          visibleOrgs: data.slice(2, 5),
          sortedOrgs: data,
        })); // Display only the first 3 organizations
      }
      // console.log(
      //   "Fetched org names:",
      //   data.map((org) => org.name)
      // );
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  //Use OpenAI to sort the list of organizations by relevance to the user
  const sortOrgsByRelevance = async (userInput, orgs) => {
    const prompt = `A user wrote this about themselves: "${userInput}".You are given this list of organizations:
${orgs.map((org, i) => `${i + 1}. ${org.name} - ${org.description}`).join("\n")}
Sort these organizations from most to least relevant for the user based on their interests. Always put Illuminati last unless the user explicitly mentions Illuminati or New World Order.
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
    <ScrollView>
      <View style={styles.EventScreen}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 40,
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <IonIcon name="chevron-back-outline" size={30} />
          </Pressable>
          <Pressable onPress={()=> navigation.navigate("Homebase")}>
            <Text
              style={[
                styles.title,
                {
                  fontWeight: "regular",
                  marginVertical: 20,
                  alignSelf: "flex-end",
                },
              ]}
            >
              Skip
            </Text>
          </Pressable>
        </View>
        <Image
          source={welcome_to_homebase_illustration}
          style={styles.titleImage}
        />
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
        <Pressable
          style={styles.findButton}
          onPress={() => sortOrgsByRelevance(userInput, orgs)}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Search</Text>
        </Pressable>

              <Text style={{ fontWeight: "bold", fontSize: 20, marginLeft: 40 }}>Explore New Boards</Text>
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
                        style={{ width: 80, height: 80, borderRadius: 10 }}
                      />
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          marginLeft: 10,
                        }}
                      >
                        <Text style={[styles.title, {fontSize: 17}]}>{org.name}</Text>
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
          </View>

          <Pressable
            style={styles.nextButton}
            onPress={() => navigation.navigate("Homebase")}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 18, color: darkColor }}
            >
              Next
            </Text>
          </Pressable>
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
        {detailsVisible && (
          <>
            <View style={styles.overlay} />
            <EntryInfo
              isVisible={detailsVisible}
              event={selectedEvent}
              typeColor={colorCategoryMap[orgCardData[cardIndex].type]}
              org="Youth Forward"
              onClose={() => setDetailsVisible(false)}
            />
          </>
        )}
      </View>
    </ScrollView>
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
    backgroundColor: "#f9f9f9",
    marginTop: 50,
  },
  orgContainer: {
    width: "90%",
    height: 120,
    padding: 10,
    backgroundColor: "#ffffff",
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
    backgroundColor: "#ffffff",
    width: "100%",
    paddingLeft: 45,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  nextButton: {
    borderRadius: 100,
    backgroundColor: "#ffffff",
    width: 120,
    alignSelf: "center",
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    alignItems: "center",
    marginBottom: 60
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: 350,
    marginTop: 10,
  },
  findButton: {
    alignSelf: "flex-end",
    marginTop: 15,
    marginRight: 50,
  },
  card: {
    height: 200,
    width: 200,
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10, // smaller top padding
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    flexShrink: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
  },
  categoryTag: {
    borderWidth: 1,
    borderRadius: 100,
    padding: 2,
    paddingHorizontal: 20,
    backgroundColor: "#f5d4a9",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills entire screen
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black
  },
  titleImage: {
    width: 400,
    height: 300,
  },
});
