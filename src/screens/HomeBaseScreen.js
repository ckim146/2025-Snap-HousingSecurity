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
  ImageBackground,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AddEvent from "../components/AddEvent";
import EventInfo from "../components/EventInfo";
import { supabase } from "../utils/hooks/supabase";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Pressable } from "react-native";
import SwipableStack from "../components/SwipableStack";

export default function HomeBaseScreen({ route, navigation }) {
  const [visible, setVisible] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
const [selectedToggle, setSelectedToggle] = useState("All");

  function toggleComponent() {
    setVisible(!visible);
    console.log(visible);
  }

  function handleCardTouch(event) {
    setDetailsVisible(true);
    console.log(detailsVisible);
    setSelectedEvent(event);
  }

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
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.EventScreen}>
      {/* BITMOJI PICTURE  */}
{/* <Image
  source={pictureofbitmoji} // or use { uri: "https://..." }
  style={styles.topImage}
/> */}
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

      <View style={styles.headerContainer}>

        <View style={styles.topBannerContainer}>
    <IonIcon name="chevron-back" size={24} color="black" />
    <View style={styles.spyLogoContainer}>
      <Text style={styles.spyText}>
        S. P. <Text style={{ color: "#00BFFF" }}>Y</Text>
      </Text>
      <Text style={styles.spySubtext}>safe place for youth</Text>
    </View>
    <IonIcon name="chevron-forward" size={24} color="black" />
  </View>

  {/* TOGGLE */}
  <View style={styles.toggleContainer}>
    <Pressable
      style={[
        styles.toggleButton,
        selectedToggle === "All" && styles.toggleActive,
      ]}
      onPress={() => setSelectedToggle("All")}
    >
      <Text
        style={[
          styles.toggleText,
          selectedToggle === "All" && styles.toggleTextActive,
        ]}
      >
        All
      </Text>
    </Pressable>
    <Pressable
      style={[
        styles.toggleButton,
        selectedToggle === "Orgs" && styles.toggleActive,
      ]}
      onPress={() => setSelectedToggle("Orgs")}
    >
      <Text
        style={[
          styles.toggleText,
          selectedToggle === "Orgs" && styles.toggleTextActive,
        ]}
      >
        Orgs
      </Text>
    </Pressable>
  </View>

  {/* HOME BASE & SEARCH ICON */}
  <View style={styles.bottomHeaderRow}>
    {/* <Text style={styles.mainHeader}>Home Base</Text> */}
    <Pressable onPress={() => navigation.navigate("Notifications")}>
      <IonIcon name="search-circle-outline" size={50} color="black" />
    </Pressable>
  </View>
</View>

{/* corkboard */}

<View style={styles.corkBoardContainer}>
        <View style={styles.corkBoardBanner}>
          <View style={styles.cardHeader}>
            <View style={styles.textColumn}>
              <Text style={styles.bannerTitle}>Cork Board</Text>
              <Text style={styles.bannerSubtitle}>
                Posts and tips from your local orgs
              </Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate("CorkBoardScreen")}
              style={{ marginLeft: "auto" }}
            >
              <IonIcon
                name="chevron-forward-outline"
                size={32}
                color="white"
              />
            </Pressable>
          </View>
        </View>
</View>
          {/* Filter Tabs */}

      <View style={styles.corkBoardCard}>
    <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.filterTabs}
>
  {/* 
  Scalability 
  Not focusing the prototype 
  Focus on explaining features and functionality
  safety and protocols
  Engineers:
  orgs choose what they want to share, their corkboard their posts
  Features / Safety / Functionality
  NO PROTOTYPE -> Features, Process 

  Designers:
  speak on the feature 
  corboard and maps

  Storytellers:
  personas
  timeline
  partenerships
  scalability
  
  check for resets 
  
  figure out workflow situation 
  



  */}
  {["ALL", "EVENTS", "TIPS", "HELP REQUESTS", "ANNOUNCEMENTS"].map((tab, i) => (
    <Pressable key={i} style={[styles.tab, i === 0 && styles.activeTab]}>
      <Text style={[styles.tabText, i === 0 && styles.activeTabText]}>{tab}</Text>
    </Pressable>
  ))}
</ScrollView>

    <View style={styles.stickyNoteGrid}>
      
    {/* <View style={styles.stickyNote}>
      <Text style={styles.noteTitle}>Resume Workshop</Text>
      <Text style={styles.noteDate}>Wed, 8/16</Text>
      <Text style={styles.noteInfo}>2–3pm • Online</Text>
    </View> */}
<SwipableStack />
<SwipableStack />
<SwipableStack />
     {/* <View style={styles.stickyNote}>
    <Text style={styles.noteTitle}>Job Fairs</Text>
    <Text style={styles.noteDate}>Fri, 8/18</Text>
    <Text style={styles.noteInfo}>1–4pm • In Person</Text>
  </View>

  <View style={styles.stickyNote}>
    <Text style={styles.noteTitle}>Mental Health Talk</Text>
    <Text style={styles.noteDate}>Mon, 8/21</Text>
    <Text style={styles.noteInfo}>10–11am • Online</Text>
  </View>

  <View style={styles.stickyNote}>
    <Text style={styles.noteTitle}>Free Haircuts</Text>
    <Text style={styles.noteDate}>Tues, 8/22</Text>
    <Text style={styles.noteInfo}>12–3pm • Drop-in</Text>
  </View>

  <View style={styles.stickyNote}>
    <Text style={styles.noteTitle}>Backpack Giveaway</Text>
    <Text style={styles.noteDate}>Sat, 8/24</Text>
    <Text style={styles.noteInfo}>11am–2pm • Local Org</Text>
  </View> */}

    {/* You can add more sticky notes or map over an array */}
  </View>


{/* MAP CARD */}
      {/* <View style={styles.MapCard}>
        
        <View style={styles.cardHeader}>
        <Text style={[styles.header, { flex: 1, paddingVertical: 0}]}>Map</Text>
                <Pressable //Arrow Icon
          onPress={() => navigation.navigate("UserTab", {screen: "Map"})}
          style={{ marginLeft: "auto" }}
        >
          <IonIcon name="chevron-forward-outline" size={32} color="black" />
        </Pressable>
        </View>

      </View> */}
</View>

  </ScrollView>

      {/* <ScrollView> */}
        <View style={styles.Events}>
          {/* {orgs.map((event) => (
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
  corkBoardBanner:{
backgroundColor: "#8040C4",
  padding: 16,
  // borderTopLeftRadius: 20,
  // borderTopRightRadius: 20,
  // borderBottomLeftRadius: 0,
  // borderBottomRightRadius: 0,

  },
  corkBoardContainer: {
  // marginHorizontal: 10,

  marginTop: 150,
},

  container: {
    width: "48%",
    backgroundColor: "#E5E5E5",
    display: "flex",
    justifyContent: "space-between",
    // alignItems:"center",
    // padding: 10,
    // gap:10,
    borderRadius: 20,
    maxHeight: 250,
    margin: 0,
  },
  topImage: {
  width: "100%",
  height: 200, // Adjust height to fit your image
  resizeMode: "cover", 
  marginBottom: -20,   // pull it up over the banner
  zIndex: 10,          
},
  headerContainer: {
  //   width: "90%",
  //   flexDirection: "row",
  //   alignItems: "center",
  //   display: "flex",
  //   justifyContent: "space-between",
    
  //   borderRadius: 20,
  //   maxHeight: 250,
  //     paddingTop: 20,
  // paddingBottom: 20,
  //   margin: 0,
  width: "100%",
  alignItems: "center",
  paddingTop: 30,
  paddingBottom: 20,
  backgroundColor: "#fff",
  },
  textColumn: {
  flexDirection: "column", // stack vertically
  gap: 4,                  // spacing between title + subtitle
},
  cardHeader: {

    flexDirection: "row",
  alignItems: "center",
  gap: 12,
//this
    // flexDirection: "row",
    // alignItems: "center",
    // width: "100%",
    // height: 60,

    // backgroundColor: "#E5E5E5",
    // padding: 10,
    // gap:10,
//this
    // borderRadius: 20,

    // maxHeight: 250,
    // margin: 0,
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
  },
  mainHeader: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 40,
    marginTop: 10,
    marginBottom: 10,
  },
  bottomHeaderRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  paddingTop: 12,
},

topBannerContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  paddingHorizontal: 30,
  paddingTop: 40, 
},

spyLogoContainer: {
alignItems: "center",
  justifyContent: "center",
  marginTop: -8,},

spyText: {
  fontSize: 36,
  fontWeight: "800",
  letterSpacing: 5,
},

spySubtext: {
  fontSize: 14,
  color: "#666",
  marginTop: 6,
},

toggleContainer: {
  flexDirection: "row",
  backgroundColor: "#eee",
  borderRadius: 25,
  padding: 6,
  marginTop: 12,
  marginBottom: 20,     // push it off the S.P.Y section
  alignSelf: "center",
},

toggleButton: {
  paddingVertical: 6,
  paddingHorizontal: 20,
  borderRadius: 20,
},

toggleText: {
  fontSize: 14,
  fontWeight: "500",
  color: "#666",
},

toggleActive: {
  backgroundColor: "#ccc",
},

toggleTextActive: {
  color: "#111",
  fontWeight: "700",
},

  // how big are the cards?
  corkBoardCard: {
backgroundColor: "#fff",
  paddingVertical: 60,
  paddingHorizontal: 20,
  borderBottomLeftRadius: 20,
  backgroundColor: "#8040C4",
  borderBottomRightRadius: 20,
  width: "100%",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 5,
  marginTop: 0,
  minHeight: 500,

  paddingTop: 10,
// paddingBottom: 80,
},
corkBoardBanner: {
  backgroundColor: "#8040C4", // Snap purple-ish tone
  padding: 16,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  width: "100%",        // make the banner full-width too
  marginHorizontal: 0,
},
bannerTitle: {
  color: "white",
  fontSize: 20,
  fontWeight: "bold",
},

bannerSubtitle: {
  color: "white",
  fontSize: 14,
  marginTop: 2,
  flexShrink: 1,
},

  MapCard: {
    backgroundColor: "white",
    borderWidth: 0,
    height: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    width: "80%",
    alignSelf: "center",
    top: "5%",
    borderRadius: 20,
    paddingHorizontal: 20,
    // paddingTop: 12,
    paddingBottom: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  stickyNoteGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",   
  gap: 16,                     // optional: give space between items
  paddingHorizontal: 12,
  paddingTop: 13,
},

stickyNote: {
  backgroundColor: "#CDEDE1",
  width: 150,
  height: 150,
  padding: 12,
  borderRadius: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
  justifyContent: "space-between",
},

noteTitle: {
  fontWeight: "bold",
  fontSize: 16,
},

noteDate: {
  fontWeight: "600",
  fontSize: 14,
},

noteInfo: {
  color: "#444",
  fontSize: 12,
},
filterTabs: {
  flexDirection: "row",
  paddingHorizontal: 12,
  gap: 10,
  marginTop: 8,
  marginBottom: 4, // 👈 tighter bottom margin
},





tab: {
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "#ccc",
  backgroundColor: "white",
},

activeTab: {
  backgroundColor: "#c09b6dff", // Snap-style orange or any color you want
  borderColor: "#71512aff",
},

tabText: {
  fontSize: 14,
  fontWeight: "600",
  color: "#333",
},

activeTabText: {
  color: "white",
},
});
