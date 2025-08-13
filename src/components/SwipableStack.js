import React, { use, useEffect, useCallback, useMemo } from "react";
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import orgIcon2 from "../../assets/safe_place_for_youth_logo.jpeg";
import orgIcon3 from "../../assets/smc_logo.png";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import Swiper from "react-native-deck-swiper"; //SWIPING CARDS 
import cardProfilePic from "../../assets/cardProfilePic.png";
import Color from "color";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import EntryInfo from "../components/EntryInfo";
import * as Location from "expo-location";
import {HomeBaseScreen} from "../screens/HomeBaseScreen";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.4; // same proportion as your sticky notes
const CARD_HEIGHT = CARD_WIDTH; // square like your sticky notes

export default function SwipableStack({
  route,
  navigation,
  cardData,
  fadeToggle,
  isMyOrgs = false,
  userOrgs = [],
  activeOrgName = "",
  onPrevOrg,
  onNextOrg,
}) {
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
  // const [cards, setCards] = useState(orgCardData);
  const [cardIndex, setCardIndex] = useState(0);
  const [popupX, setPopupX] = useState(null);
  const [popupY, setPopupY] = useState(null);
  const [addresses, setAddresses] = React.useState([]);
  const swiperRef = useRef(null);
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
    workshop: "rgba(255, 211, 216, 1)",
    event: "rgb(203, 249, 228)",
    Tips: "rgb(255, 226, 186)",
    volunteer: "rgb(235, 215, 254)",
  };



  //added 
  const NOTE_COLORS = {
  resources: { paper: "#DFF6EE", accent: "#1A9E74", arrowBg: "#F5FFFC" },
  skills:    { paper: "#FADDE1", accent: "#C44A65", arrowBg: "#FFF1F4" },
  social:    { paper: "#E5D5FF", accent: "#5C3FBF", arrowBg: "#F6F2FF" },
  tips:      { paper: "#F6E0B8", accent: "#8B6A2E", arrowBg: "#FFF7E6" },
};

const typeToNote = (t = "") => {
  const k = t.toLowerCase();
  if (k.includes("skill") || k.includes("workshop")) return "skills";
  if (k.includes("volunteer") || k.includes("social")) return "social";
  if (k.includes("tip")) return "tips";
  return "resources";
};



  function toggleEntryInfoVisible() {
    setDetailsVisible(true);
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
//fixed
   const handleCardTouch = useCallback((event) => {
    setSelectedEvent(event);
    setDetailsVisible(true);
  }, []);



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
  //Fetch all addresses depending on coordinates
  useEffect(() => {
    const fetchAllAddresses = async () => {
      if (!Array.isArray(cardData)) return;
      const results = await Promise.all(
        cardData.map((card) => {
          const coords = card?.location;
          if (!coords || typeof coords.latitude !== "number" || typeof coords.longitude !== "number") {
            return Promise.resolve(null);
          }
          return Location.reverseGeocodeAsync({
            latitude: coords.latitude,
            longitude: coords.longitude,
          })
          .then((g) => (g?.[0] ? `${g[0].city}, ${g[0].region}` : null))
          .catch(() => null);
        })
      );
      setAddresses(results);
    };
    fetchAllAddresses();
  }, [cardData]);

  const cardsWithAddresses = useMemo(() => {
    return cardData.map((card, i) => ({
      ...card,
      address: addresses[i] || null,
    }));
  }, [cardData, addresses]);

  const resetStack = () => {
    setCards([...cardsWithAddresses]);
    setCardIndex(0);
    // Also reset the swiper internal state by jumping to index 0
    if (swiperRef.current) {
      swiperRef.current.jumpToCardIndex(0);
    }
  };



// // state
// const [userOrgs, setUserOrgs] = useState([]);
// const [activeOrgIdx, setActiveOrgIdx] = useState(0);

// // derived
// const activeOrg = userOrgs[activeOrgIdx] || null;
// const activeOrgId = activeOrg?.org_id ?? activeOrg?.id;   // depending on your select shape
// const activeOrgName = activeOrg?.organizations?.name ?? activeOrg?.name ?? "My Org";


// useEffect(() => {
//   const loadUserOrgs = async () => {
//     const { data, error } = await supabase
//       .from("org_user_assignments")
//       .select(`org_id, organizations(name, logo)`)
//       .eq("user_id", user.id);

//     if (!error) {
//       // keep whatever shape you prefer — just make sure activeOrgId resolves
//       setUserOrgs(data || []);
//       setActiveOrgIdx(0);
//     } else {
//       console.error(error);
//     }
//   };
//   if (user?.id) loadUserOrgs();
// }, [user?.id]);


// useEffect(() => {
//   if (!activeOrgId) return;

//   const fetchOrgEntries = async () => {
//     const { data, error } = await supabase
//       .from("corkboard_entries")
//       .select("*")
//       .eq("org_id", activeOrgId)
//       .order("created_at", { ascending: false });

//     if (error) { console.error(error); return; }

//     // group by type for your grid-of-stacks UI
//     const grouped = {};
//     for (const row of data) {
//       const t = row.type || "Other";
//       (grouped[t] ||= []).push({
//         id: row.id,
//         title: row.title,
//         date: row.date,          // adjust to your column names
//         time: row.time,
//         type: row.type,          // "Tips" | "Skills" | "Social" | "Resources" | ...
//         age: row.created_at,     // you can format to "13 mins" in render if you want
//         location: row.location,  // if you store JSON coords
//         pinned: row.pinned === true,
//         user: row.user,
//         profilePic: row.profile_pic ? { uri: row.profile_pic } : undefined,
//       });
//     }
//     setEntriesByCat(grouped);
//   };

//   fetchOrgEntries();
// }, [activeOrgId]);





// <View style={styles.slotWrapContainer}>
//   {Object.entries(entriesByCat).map(([type, items]) => (
//     <View key={type} style={styles.slotWrap}>
//       <Text style={styles.slotLabel}>{type}</Text>
//       <SwipableStack
//         key={activeOrgId + "-" + type} // reset swiper when org changes
//         cardData={items}
//         fadeToggle={() => fadeToggle(type)}
//       />
//       <SwipableStack
//   isMyOrgs={isMyOrgs}
//   userOrgs={userOrgs}
//   activeOrgName={activeOrgName}
//   onPrevOrg={prevOrg}
//   onNextOrg={nextOrg}
//   cardData={items}
//   fadeToggle={() => fadeToggle(type)}
// />

//     </View>
//   ))}
// </View>


















  return (
    <View style={styles.cardContainer}>
      {/* Show reset button centered when all cards are swiped */}
      {cardIndex  >= cardData.length  && (
        <View style={styles.resetContainer}>
        <TouchableOpacity onPress={resetStack} style={styles.resetButton}>
          <Icon name="refresh" size={30} color="#333" />
        </TouchableOpacity>
         </View>
      )}
      {/** Titled background card */}
      <View
        style={[
          styles.card,
          {
            position: "absolute",
            alignSelf: "center", // center horizontally
            top: "70%",
            transform: [
              { translateX: 0 },
              { translateY: -123 }, // half of card height to center vertically
              { rotate: "-7deg" },
            ],
            backgroundColor: Color(colorCategoryMap[cardData[0].type])
              .darken(0.2)
              .rgb()
              .string(), // match first card's color
            zIndex: 1,
          },
        ]}
      />
      <Swiper
        ref={swiperRef}
        cards={cardsWithAddresses}
        // renderCard={(card, index) => (
        //   <View
        //     style={[
        //       styles.card,
        //       {
        //         backgroundColor: colorCategoryMap[card.type],
        //         width: CARD_WIDTH,
        //       },
        //     ]}
        //   >
        //     <View style={styles.cardContent}>
        //       {/*The horizontal view containing category and card # */}
        //       <View
        //         style={{
        //           flexDirection: "row",
        //           justifyContent: "space-between",
        //         }}
        //       >
        //         <View>
        //           {typeof card.address === "string" && (
        //             <Text
        //               style={{
        //                 alignSelf: "center",
        //                 color: Color(colorCategoryMap[card.type])
        //                   .darken(0.7)
        //                   .rgb()
        //                   .string(),
        //                 fontSize: 10,
        //               }}
        //             >
        //               {card.address}
        //             </Text>
        //           )}
        //         </View>
        //         <Text
        //           style={{
        //             fontSize: 14,
        //             color: Color(colorCategoryMap[card.type])
        //               .darken(0.7)
        //               .rgb()
        //               .string(),
        //           }}
        //         >
        //           {cardIndex + 1}/{cardData.length}
        //         </Text>
        //       </View>

        //       {card.type == "Tips" ? (
        //         <View
        //           style={{
        //             flexDirection: "row",
        //             alignItems: "center",
        //             marginBottom: 10,
        //             marginTop: 10,
        //           }}
        //         >
        //           <Image
        //             source={card.profilePic}
        //             style={{
        //               resizeMode: "cover",
        //               height: 50,
        //               width: 50,
        //               marginRight: 10,
        //             }}
        //           />
        //           <View style={{ flexDirection: "column" }}>
        //             <Text style={[styles.title, { marginBottom: 0 }]}>
        //               {card.user}
        //             </Text>
        //             <Text
        //               style={{
        //                 color: Color(colorCategoryMap[card.type])
        //                   .darken(0.5)
        //                   .rgb()
        //                   .string(),
        //               }}
        //             >
        //               Verified Member
        //             </Text>
        //           </View>
        //         </View>
        //       ) : null}
        //       <Pressable onPress={() => handleCardTouch(card)}>
        //         <Text
        //           style={{
        //             fontSize: 22,
        //             color: "#4b3b1f",
        //             marginBottom: 12,
        //           }}
        //           numberOfLines={2}
        //           ellipsizeMode="tail"
        //           // adjustsFontSizeToFit
        //           minimumFontScale={0.8}
        //         >
        //           {card.title}
        //         </Text>
        //       </Pressable>
        //       <View style={{ flexDirection: "column" }}>
        //         <Text
        //           style={[
        //             styles.title,
        //             {
        //               marginBottom: 0,
        //               marginTop: 0,
        //               color: Color(colorCategoryMap[card.type])
        //                 .darken(0.7)
        //                 .rgb()
        //                 .string(),
        //             },
        //           ]}
        //         >
        //           {card.date}
        //         </Text>
        //         <Text
        //           style={{
        //             color: Color(colorCategoryMap[card.type])
        //               .darken(0.7)
        //               .rgb()
        //               .string(),
        //           }}
        //         >
        //           {card.time}
        //         </Text>
        //       </View>
        //       <View
        //         style={{
        //           flexDirection: "row",
        //           justifyContent: "space-between",
        //         }}
        //       >
        //         <Text
        //           style={{
        //             color: Color(colorCategoryMap[card.type])
        //               .darken(0.5)
        //               .rgb()
        //               .string(),
        //           }}
        //         >
        //           {card.age} ago
        //         </Text>
        //         <Pressable onPress={fadeToggle}>
        //           <View
        //             style={[
        //               styles.arrowBtn,
        //               {
        //                 backgroundColor: Color(colorCategoryMap[card.type])
        //                   .lighten(0.5)
        //                   .rgb()
        //                   .string(),
        //               },
        //             ]}
        //           >
        //             <IonIcon name="arrow-forward" size={18} color="#6b6b6b" />
        //           </View>
        //         </Pressable>
        //       </View>
        //     </View>
        //   </View>
        // )}


        //STYLING OF THE CARDS(BOLDER)
        onSwiped={(index) => {
          setCardIndex((prev) => prev + 1);
        }}
        // onSwipedAll={() => setCardIndex(0)}
        cardIndex={cardIndex} 
        cardVerticalMargin={0}
        backgroundColor="transparent"
        stackSize={3}
        stackSeparation={0}
        animateCardOpacity
        stackScale={1}
        containerStyle={styles.swiperContainer}
        cardStyle={styles.card}

        renderCard={(card) => {
    const noteKey = typeToNote(card?.type);
    const c = NOTE_COLORS[noteKey] || NOTE_COLORS.resources;

    return (
      <View style={[styles.card, { backgroundColor: c.paper, width: CARD_WIDTH }]}>
        <View style={styles.cardContent}>
          {!!card?.address && <Text style={styles.cityText}>{card.address}</Text>}

          <Pressable onPress={() => handleCardTouch(card)}>
            <Text style={styles.noteTitleBig} numberOfLines={2} ellipsizeMode="tail">
              {card?.title}
            </Text>
          </Pressable>

          {!!card?.date && <Text style={[styles.whenBold, { color: c.accent }]}>{card.date}</Text>}
          {!!card?.time && <Text style={styles.whenSub}>{card.time}</Text>}

          <View style={styles.noteBottomRow}>
            {!!card?.age && <Text style={styles.agoText}>{card.age} ago</Text>}
            <Pressable onPress={fadeToggle}>
              <View style={[styles.arrowBtn, { backgroundColor: c.arrowBg }]}>
                <IonIcon name="arrow-forward" size={18} color="#6b6b6b" />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }}
/>
{/* NEW STYLING ENDS */}


        {/* // disableBottomSwipe
        // disableTopSwipe */}
      {/* /> */}
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
              typeColor={colorCategoryMap[cardData[0].type]}
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
    margin: 5,
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
    shadowOpacity: 0.10,
    shadowRadius: 2,
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
    justifyContent: "space-between",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills entire screen
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black
  },
  categoryTag: {
    // borderWidth: 1,
    // borderRadius: 100,
    padding: 2,
    paddingHorizontal: 20,
    // backgroundColor: "#f5d4a9",
    alignItems: "center",
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
resetContainer: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "transparent",
  zIndex: 10,
},
resetButton: {
  padding: 10,
  borderRadius: 20,
  backgroundColor: 'rgba(0,0,0,0.1)',
  zIndex: 10
},
// SwipableStack styles- NEW
pin: {
  position: "absolute",
  top: 10,
  right: 10,
  width: 14,
  height: 14,
  borderRadius: 7,
  backgroundColor: "#D3382F",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.25,
  shadowRadius: 1.5,
},

cityText: { fontSize: 12, color: "#7a7a7a", marginBottom: 4 },
noteTitleBig: { fontSize: 18, fontWeight: "800", color: "#3a3a3a", marginBottom: 10 },
whenBold: { fontSize: 16, fontWeight: "800", marginBottom: 2 },
whenSub: { fontSize: 14, color: "#555", marginBottom: 8 },
noteBottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "auto" },
agoText: { fontSize: 12, color: "#6f6f6f" },
});
