import React, { use, useEffect, useCallback } from "react";
import { useRef, useState } from "react";

import { Card, FAB } from "@rn-vui/themed";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.30; // same proportion as your sticky notes
const CARD_HEIGHT = CARD_WIDTH; // square like your sticky notes

export default function SwipableStack({ route, navigation, cardData }) {
  const [visible, setVisible] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const wrapperRef = useRef(null);
  const [popupRect, setPopupRect] = useState(null);
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
  const [popupX, setPopupX] = useState(null);
  const [popupY, setPopupY] = useState(null);

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setPopupY((SCREEN_HEIGHT - height) / 2);
    setPopupX((SCREEN_WIDTH - POPUP_WIDTH) / 2);
  };

  const POPUP_WIDTH = SCREEN_WIDTH * 0.8; // 80% of screen width
  const POPUP_HEIGHT = SCREEN_HEIGHT * 0.5; // 50% of screen height
  //changed

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
        "Whether it's to freshen up for a job interview or for your friends, all memebers are offered a free haircut.",
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
    console.log("test");
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
    <View style={styles.cardContainer}>
      <View
        style={[
          styles.card,
          {
            position: "absolute",
            alignSelf: "center", // center horizontally
            top: "70%",
            transform: [
              { translateX: 0 },
              { translateY: -125 }, // half of card height to center vertically
              { rotate: "-7deg" },
            ],
            backgroundColor: Color(colorCategoryMap[orgCardData[0].type])
              .darken(0.2)
              .rgb()
              .string(), // match first card's color
            zIndex: 1,
          },
        ]}
      />
      <Swiper
        cards={orgCardData}
        renderCard={(card) => (
          <View
            style={[
              styles.card,
              { backgroundColor: colorCategoryMap[card.type] },
            ]}
          >
            <View style={styles.cardContent}>
              {/*The horizontal view containing category and card # */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={[
                    styles.categoryTag,
                    {
                      backgroundColor: Color(colorCategoryMap[card.type])
                        .lighten(0.1)
                        .rgb()
                        .string(),
                      alignSelf: "flex-start",
                      borderColor: Color(colorCategoryMap[card.type])
                        .darken(0.7)
                        .rgb()
                        .string(),
                    },
                  ]}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      color: Color(colorCategoryMap[card.type])
                        .darken(0.7)
                        .rgb()
                        .string(),
                      fontSize: 10,
                    }}
                  >
                    {card.type}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: Color(colorCategoryMap[card.type])
                      .darken(0.7)
                      .rgb()
                      .string(),
                  }}
                >
                  {cardIndex + 1}/{orgCardData.length}
                </Text>
              </View>

              {card.type == "Tips" ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                    marginTop: 10,
                  }}
                >
                  <Image
                    source={card.profilePic}
                    style={{
                      resizeMode: "cover",
                      height: 50,
                      width: 50,
                      marginRight: 10,
                    }}
                  />
                  <View style={{ flexDirection: "column" }}>
                    <Text style={[styles.title, { marginBottom: 0 }]}>
                      {card.user}
                    </Text>
                    <Text
                      style={{
                        color: Color(colorCategoryMap[card.type])
                          .darken(0.5)
                          .rgb()
                          .string(),
                      }}
                    >
                      Verified Member
                    </Text>
                  </View>
                </View>
              ) : null}
              <Pressable onPress={() => handleCardTouch(card)}>
                <Text
                  style={{
                    fontSize: 22,
                    color: "#4b3b1f",
                    marginBottom: 12,
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  {card.title}
                </Text>
              </Pressable>
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={[
                    styles.title,
                    {
                      marginBottom: 0,
                      marginTop: 0,
                      color: Color(colorCategoryMap[card.type])
                        .darken(0.7)
                        .rgb()
                        .string(),
                    },
                  ]}
                >
                  {card.date}
                </Text>
                <Text
                  style={{
                    color: Color(colorCategoryMap[card.type])
                      .darken(0.7)
                      .rgb()
                      .string(),
                  }}
                >
                  {card.time}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: Color(colorCategoryMap[card.type])
                      .darken(0.5)
                      .rgb()
                      .string(),
                  }}
                >
                  {card.age} ago
                </Text>
                <IonIcon name="arrow-redo-outline" size={20}></IonIcon>
              </View>
            </View>
          </View>
        )}
        onSwiped={(index) => setCardIndex(index + 1)}
        onSwipedAll={() => setCardIndex(0)}
        cardIndex={0}
        cardVerticalMargin={0}
        backgroundColor="transparent"
        stackSize={3}
        stackSeparation={0}
        animateCardOpacity
        stackScale={1}
        containerStyle={styles.swiperContainer}
        cardStyle={styles.card}
        // disableBottomSwipe
        // disableTopSwipe
      />
      {/* {detailsVisible && (
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
      )} */}

      {detailsVisible && (
        <Modal
          transparent
          visible={detailsVisible}
          animationType="fade"
          onRequestClose={() => setDetailsVisible(false)}
        >
          {/* full-screen overlay that closes popup when tapped */}
          <TouchableWithoutFeedback onPress={() => setDetailsVisible(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>

          {/* Positioned popup that exactly matches card location/size */}
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
            {/* Make EntryInfo fill this container */}
            <View style={styles.overlay} />
            <EntryInfo
              isVisible={detailsVisible}
              event={selectedEvent}
              typeColor={colorCategoryMap[orgCardData[cardIndex].type]}
              org="Youth Forward"
              onClose={() => setDetailsVisible(false)}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: "center",
    justifyContent: "space-between",
    
  },
  swiperContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    // backgroundColor: "#FFFDD0", // your sticky note color
    borderRadius: 12,
    margin: 0,
    left: 0,
    top: 0,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,

  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noteDate: {
    fontSize: 14,
    marginTop: 4,
  },
  noteInfo: {
    fontSize: 13,
    marginTop: 4,
  },
  cardContent: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills entire screen
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black
  },
  categoryTag: {
    borderWidth: 1,
    borderRadius: 100,
    padding: 2,
    paddingHorizontal: 20,
    backgroundColor: "#f5d4a9",
    alignItems: "center",
  },
});
