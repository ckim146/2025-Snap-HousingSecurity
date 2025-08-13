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
import pictureofmyorg from "../../assets/pictureofmyorg.png";
import pictureofallposts from "../../assets/pictureofallposts.png";
import { LinearGradient } from "expo-linear-gradient";

//IMPORTING BITMOJI AVATAR PICTURES
import lesliepic from "../../assets/lesliebitmoji.png";
import alexpic from "../../assets/alexbitmoji.png";
import amberpic from "../../assets/amberbitmoji.png";
import andrewpic from "../../assets/andrewbitmoji.png";
import emmapic from "../../assets/emmabitmoji.png";
import joepic from "../../assets/joebitmoji.png";

//SWIPEABLE STACK COMPONENT
import SwipeableStack from "../components/SwipableStack";
import EntryInfo from "../components/EntryInfo";

import { useHeaderHeight } from "@react-navigation/elements";

export default function HomeBaseScreen({ route, navigation }) {
  const [visible, setVisible] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedToggle, setSelectedToggle] = useState("All");
  //to fit image in the main page of homebase
  // const { width: heroW, height: heroH } =
  //   Image.resolveAssetSource(pictureofmyorg);
  // const HERO_RATIO = heroW / heroH;
  const [feedTab, setFeedTab] = useState("My Orgs");

  const isMyOrgs = feedTab === "My Orgs";
  const isAllPosts = feedTab === "All Posts";
  const heroSource = isMyOrgs ? pictureofmyorg : pictureofallposts;
  const { width: hw, height: hh } = Image.resolveAssetSource(heroSource);
  const HERO_RATIO = hw / hh;
  //header is inside
  const headerHeight = useHeaderHeight();

  // palette per category
  const NOTE_COLORS = {
    resources: {
      paper: "#DFF6EE",
      back: "#9FE3C7",
      accent: "#1A9E74",
      arrowBg: "#F5FFFC",
    },
    skills: {
      paper: "#FADDE1",
      back: "#F7B9C0",
      accent: "#C44A65",
      arrowBg: "#FFF1F4",
    },
    social: {
      paper: "#E5D5FF",
      back: "#C9B3FF",
      accent: "#5C3FBF",
      arrowBg: "#F6F2FF",
    },
    tips: {
      paper: "#F6E0B8",
      back: "#E2C48C",
      accent: "#8B6A2E",
      arrowBg: "#FFF7E6",
    },
  };

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
  // contentContainerStyle={{ paddingTop: headerHeight + 8  }}

  const onSelectFeed = (tab) => {
    if (tab === "My Orgs") {
      setFeedTab("My Orgs");
      navigation.navigate("CorkBoardScreen"); // <- go to corkboard
    } else {
      setFeedTab("All Posts"); // stay on this screen
    }
  };

  function StickyCard({
    category = "resources",
    org,
    title,
    dateLine,
    timeLine,
    postedAgo,
    onPress,
    variant = "note",
    showBack = false,
    showPin = false,
    avatarUri,
    tag,
    views = 0,
  }) {
    const c = NOTE_COLORS[category] || NOTE_COLORS.resources;
    const isPost = variant === "post";
    const imgSource =
      typeof avatarUri === "string" ? { uri: avatarUri } : avatarUri;
    return (
      <Pressable style={styles.noteWrap} onPress={onPress}>
        {!isPost && showBack && (
          <View style={[styles.noteBack, { backgroundColor: c.back }]} />
        )}

        <View
          style={[
            styles.stickyNoteCard,
            { backgroundColor: c.paper },
            isPost && styles.postCard, // extra inner bottom space
          ]}
        >
          {!isPost && showPin && <View style={styles.pin} />}

          {/* {!!city && (
          <Text style={isPost ? styles.postCity : styles.cityText}>{city}</Text>
        )} */}

          {/* <Text
          style={isPost ? styles.postTitle : styles.noteTitleBig}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text> */}

          {isPost ? (
            <>
              {/* header: avatar + org */}
              <View style={styles.postHeaderRow}>
                {avatarUri ? (
                  <Image source={imgSource} style={styles.avatar32} />
                ) : (
                  <View style={[styles.avatar32, styles.avatarPlaceholder]} />
                )}
                <Text
                  style={styles.orgName}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {org}
                </Text>
              </View>

              {/* body */}
              <Text style={styles.postBody} numberOfLines={4}>
                {title}
              </Text>

              {/* time */}
              {!!postedAgo && <Text style={styles.postAgo}>{postedAgo}</Text>}

              {/* bottom meta */}
              <View style={styles.metaRow}>
                {!!tag && (
                  <View style={styles.tagPill}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                )}
                <View style={styles.eyeRow}>
                  <IonIcon name="eye-outline" size={16} color="#6b5b4b" />
                  <Text style={styles.eyeCount}>{views}</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              {!!org && <Text style={styles.cityText}>{org}</Text>}
              <Text style={styles.noteTitleBig}>{title}</Text>
              {!!dateLine && (
                <Text style={[styles.whenBold, { color: c.accent }]}>
                  {dateLine}
                </Text>
              )}
              {!!timeLine && <Text style={styles.whenSub}>{timeLine}</Text>}

              <View style={styles.noteBottomRow}>
                {!!postedAgo && <Text style={styles.agoText}>{postedAgo}</Text>}
                <View style={[styles.arrowBtn, { backgroundColor: c.arrowBg }]}>
                  <IonIcon name="arrow-forward" size={18} color="#6b6b6b" />
                </View>
              </View>
            </>
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="never">
        {/* HERO */}
        <View style={styles.heroWrap}>
          <ImageBackground
            source={heroSource}
            style={[styles.hero, { height: 380 }]} // width 100% + aspectRatio => perfect fit, aspectRatio: HERO_RATIO,
            imageStyle={styles.heroImage} // bottom-only radius (optional)
            resizeMode="cover"
          >
            {/* dark-to-clear overlay so white text pops */}
            <LinearGradient
              colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.15)", "rgba(0,0,0,0)"]}
              locations={[0, 0.4, 1]}
              style={StyleSheet.absoluteFill}
            />
            {/* THE HOMEBASE SECTION - SPY CIRCLES GO UP AND DOWN */}
            <View style={[styles.heroInner, { paddingTop: headerHeight - 13 }]}>
              {/* top row: center title, avatar on right.
                  back arrow is native (transparent header), so left stays empty to keep title centered */}
              <View style={styles.topRow}>
                <View style={{ width: 40 }} />
                <Text style={styles.h1}>Home Base</Text>
                <Pressable
                  style={styles.avatarBtn}
                  onPress={() => {
                    /* open profile */
                  }}
                >
                  <View style={styles.avatar} />
                </Pressable>
              </View>

              <Text style={styles.subtitle}>
                Find help, share tips, stay connected.
              </Text>

              {/* brown segmented control */}
              <View style={styles.segment}>
                <Pressable
                  style={[
                    styles.segmentBtn,
                    feedTab === "My Orgs" && styles.segmentBtnActive,
                  ]}
                  onPress={() => setFeedTab("My Orgs")}
                >
                  <Text
                    style={[
                      styles.segmentTxt,
                      feedTab === "My Orgs" && styles.segmentTxtActive,
                    ]}
                  >
                    My Orgs
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.segmentBtn,
                    feedTab === "All Posts" && styles.segmentBtnActive,
                  ]}
                  onPress={() => setFeedTab("All Posts")}
                >
                  <Text
                    style={[
                      styles.segmentTxt,
                      feedTab === "All Posts" && styles.segmentTxtActive,
                    ]}
                  >
                    All Posts
                  </Text>
                </Pressable>
              </View>

              {/* S.P.Y bubble w/ arrows */}
              {/* <View style={styles.carouselRow}> */}
              <View style={styles.spyBubbleWrap}>
                <Pressable
                  style={[styles.arrowAbs, styles.arrowLeft]}
                  onPress={() => {
                    /* prev */
                  }}
                >
                  <IonIcon name="chevron-back" size={26} color="#fff" />
                </Pressable>
                {/* <IonIcon name="chevron-back" size={26} color="#fff" /> */}
                <View style={styles.spyBubble}>
                  <Text style={styles.spyBubbleText}>
                    S. P. <Text style={{ color: "#00BFFF" }}>Y</Text>
                  </Text>
                  <Text style={styles.spyBubbleSub}>safe place for youth</Text>
                </View>
                {/* <IonIcon name="chevron-forward" size={24} color="#fff" /> */}
                <Pressable
                  style={[styles.arrowAbs, styles.arrowRight]}
                  onPress={() => {
                    /* next */
                  }}
                >
                  <IonIcon name="chevron-forward" size={26} color="#fff" />
                </Pressable>
                {/* </View> */}
              </View>

              {/* dots */}
              <View style={styles.dotsRow}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>

              {/* your original All / Orgs pill */}
              {/* <View style={[styles.toggleContainer, { marginTop: 12 }]}>
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
              </View> */}

              {/* floating search */}
              {/* <Pressable
                style={styles.searchFab}
                onPress={() => navigation.navigate("Notifications")}
              >
                <IonIcon name="search" size={22} color="#111" />
              </Pressable> */}
            </View>
          </ImageBackground>
        </View>

        {/* overlapping brown sheet header */}
        <View style={[styles.sheetHeader, { marginTop: -40 }]}>
          <Text style={styles.sheetTitle}>
            {isMyOrgs ? "Safe Place for Youth" : "Venice, CA"}
          </Text>
          <Text style={styles.sheetSub}>
            {isMyOrgs
              ? "Welcome to our resource board!"
              : "Public resource board for your area."}
          </Text>
        </View>

        {/* corkboard */}

        {/* Filter Tabs */}

        <View style={styles.corkBoardContainer}>
          {isMyOrgs ? (
            <View style={styles.corkBoardCard}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterTabs}
              >
                {/* search circle goes first */}

                <Pressable
                  style={styles.filterSearch}
                  onPress={() => navigation.navigate("Search")}
                >
                  <IonIcon name="search" size={20} color="#5b432f" />
                </Pressable>
                {[
                  "Help with bills",
                  "Transportation",
                  "HELP REQUESTS",
                  "ANNOUNCEMENTS",
                ].map((tab, i) => (
                  <Pressable
                    key={i}
                    style={[styles.tab, i === 0 && styles.activeTab]}
                  >
                    <Text
                      style={[styles.tabText, i === 0 && styles.activeTabText]}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                ))}
                <View style={{ width: 8 }} />
              </ScrollView>

              <View style={styles.stickyNoteGrid}>
                <View style={styles.slotWrap}>
                  <Text style={styles.slotLabel}>Resources</Text>

                  <SwipeableStack
                    showBack={!isAllPosts} // 👈 hide on All Posts
                    showPin={!isAllPosts}
                  />

                  {/* <StickyCard
      category="resources"
      city="Santa Monica"
      title="Free Haircuts"
      dateLine="Fri, 8/15"
      timeLine="12–4 pm"
      postedAgo="13 mins ago"
      onPress={() => handleCardTouch({ title: "Free Haircuts" })}
    /> */}
                </View>
                <View style={styles.slotWrap}>
                  <Text style={styles.slotLabel}>Skills</Text>
                  <StickyCard
                    category="skills"
                    city="Santa Monica"
                    title="Resume Workshop"
                    dateLine="Wed, 8/20"
                    timeLine="12–1 pm"
                    postedAgo="1 day ago"
                    onPress={() =>
                      handleCardTouch({ title: "Resume Workshop" })
                    }
                    showBack={!isAllPosts}
                    showPin={!isAllPosts}
                  />
                </View>

                <View style={styles.slotWrap}>
                  <Text style={styles.slotLabel}>Social</Text>
                  <StickyCard
                    category="social"
                    city="Venice"
                    title="Mural Painting"
                    dateLine="Tue, 8/19"
                    timeLine="10–4 pm"
                    postedAgo="51 mins ago"
                    showBack={!isAllPosts}
                    showPin={!isAllPosts}
                  />
                </View>

                <View style={styles.slotWrap}>
                  <Text style={styles.slotLabel}>Tips</Text>
                  <StickyCard
                    category="tips"
                    city="Member"
                    title="Emma"
                    timeLine="New food vouchers at the front desk."
                    postedAgo="16 mins ago"
                  />
                  {/* food vouchers  */}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.corkBoardCard}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterTabs}
              >
                <Pressable
                  style={styles.filterSearch}
                  onPress={() => navigation.navigate("Search")}
                >
                  <IonIcon name="search" size={20} color="#5b432f" />
                </Pressable>

                {["All", "Shelters", "Resources", "Tips"].map((tab, i) => (
                  <Pressable
                    key={i}
                    style={[styles.tab, i === 0 && styles.activeTab]}
                  >
                    <Text
                      style={[styles.tabText, i === 0 && styles.activeTabText]}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                ))}
                <View style={{ width: 8 }} />
              </ScrollView>

              {/* <View style={styles.stickyNoteGrid}>
                <View style={styles.slotWrap}> */}
              <View style={styles.cardsWrap}>
                <View style={styles.masonryRow}>
                  <View style={[styles.col, styles.colLeft, { marginTop: 30 }]}>
                    <StickyCard
                      variant="post"
                      category="tips"
                      org="Leslie"
                      avatarUri={lesliepic}
                      title="Don’t camp near Hill St. The city is removing all tents."
                      postedAgo="13 mins ago"
                      tag="TIPS"
                      views={2}
                    />

                    <StickyCard
                      variant="post"
                      category="resources"
                      org="Helping Hands"
                      title="Free hygiene kits and dental check ups today. Come join us."
                      postedAgo="53 mins ago"
                      tag="RESOURCES"
                      views={22}
                    />
                    <StickyCard
                      variant="post"
                      category="tips"
                      org="Joe"
                      avatarUri={joepic}
                      title="24 hour fitness is open 24/7 now. Show your ID for free entry."
                      postedAgo="3 hrs ago"
                      tag="TIPS"
                      views={31}
                    />
                  </View>

                  <View style={[styles.col, styles.colLeft, { marginTop: 30 }]}>
                    <StickyCard
                      variant="post"
                      category="skills"
                      org="Boys & Girls Club"
                      title="Workshop: How to build an online Portfolio. Hosted by Snapchat!"
                      postedAgo="29 mins ago"
                      tag="DEVELOPMENT"
                      views={10}
                    />

                    <StickyCard
                      variant="post"
                      category="tips"
                      org="Andrew"
                      avatarUri={andrewpic}
                      title="Shelters full at St Josephs. OPCC has a few left."
                      postedAgo="1 hr ago"
                      tag="TIPS"
                      views={31}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* THE BLUE ADD BUTTON */}
        {/* <FAB
            onPress={toggleComponent}
            style={styles.addButton}
            visible={true}
            icon={{ name: "add", color: "white" }}
            color="#334effff"
          /> */}
        <AddEvent
          isVisible={visible}
          onClose={() => {
            toggleComponent();
            refreshEvents();
          }}
        />
        {/* <EventInfo
            isVisible={detailsVisible}
            event={selectedEvent}
            onClose={() => setDetailsVisible(false)}
          /> */}
      </ScrollView>
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

  corkBoardContainer: {
    // marginHorizontal: 10,
    marginTop: 0,
    // marginTop: 150, previous one
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
    marginBottom: -20, // pull it up over the banner
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
    gap: 4, // spacing between title + subtitle
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  // addButton: {
  //   position: "absolute",
  //   bottom: 16,
  //   right: 20,
  // },
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

  spyLogoContainer: { alignItems: "center", justifyContent: "center" },

  spyText: { fontSize: 36, fontWeight: "800", letterSpacing: 5, color: "#111" },

  spySubtext: { fontSize: 14, color: "#333", marginTop: 6 },

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 25,
    padding: 6,
    marginTop: 16,
    alignSelf: "center",
  },
  searchFab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleButton: { paddingVertical: 6, paddingHorizontal: 20, borderRadius: 20 },
  toggleText: { fontSize: 14, fontWeight: "500", color: "#555" },
  toggleActive: { backgroundColor: "#fff" },
  toggleTextActive: { color: "#111", fontWeight: "700" },

  sheetHeader: {
    backgroundColor: "#5b432f",
    marginTop: -40, // overlap THE BROWN WITH the image curve a bit
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  sheetSub: { color: "#f5e9dc", marginTop: 4 },
  //CODE GO BACK - 100%
  noteWrap: {
    width: "100%",
    position: "relative",
    marginBottom: 14, // vertical space between cards
  },
  // postWrap: { width: "100%" },
  noteBack: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 9, // <= back sheet
    transform: [{ rotate: "-6deg" }], // a little tilt, not too curvy
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  noteBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  agoText: { fontSize: 12, color: "#6f6f6f" },

  // how big are the cards?
  corkBoardCard: {
    backgroundColor: "#B28255",
    paddingHorizontal: 16, // horizontal padding for the cork board
    paddingTop: 20,
    paddingBottom: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    // paddingBottom: 80,
  },
  searchFab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // corkBoardBanner: {
  //   backgroundColor: "#8040C4",
  //   padding: 16,
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   width: "100%",
  // },
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
    justifyContent: "space-between",
    rowGap: 20, // or use marginBottom on slotWrap if rowGap isn't supported
    // paddingHorizontal: 10,
    paddingTop: 26,
    columnGap: 12,
    rowGap: 20,
  },

  stickyNote: {
    backgroundColor: "#CDEDE1",
    width: 150,
    height: 100,
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: "space-between",
  },

  stickyNoteCard: {
    // height: 175, // ← hard-coded height (try 180–200) CODE GO BACK
    borderRadius: 20,
    // width: 164,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    // marginHorizontal: 0.5,
    // marginLeft:0,
    // marginRight: 1,
  },
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
  noteTitleBig: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3a3a3a",
    marginBottom: 10,
  },
  whenBold: { fontSize: 16, fontWeight: "800", marginBottom: 2 },
  whenSub: { fontSize: 14, color: "#555", marginBottom: 8 },
  noteTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    paddingHorizontal: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    marginRight: 8,
    flexShrink: 0, // <- prevents stretching
    flexGrow: 0,
  },
  //   cardContainer: {
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   justifyContent: "space-between", // pushes first and last card to edges
  //   paddingHorizontal: 12, // remove side padding if it’s pushing them in
  // },

  h1: { color: "#fff", fontSize: 28, fontWeight: "800" },
  subtitle: { color: "#fff", opacity: 0.9, marginTop: 6, textAlign: "center" },
  avatarBtn: { height: 40, width: 40, borderRadius: 20, overflow: "hidden" },
  avatar: { flex: 1, backgroundColor: "#ffd66b" }, // replace with <Image> if you have one
  segment: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "rgba(63, 44, 29, 0.92)",
    padding: 4,
    borderRadius: 24,
    marginTop: 18,
  },
  segmentBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 18 },
  segmentBtnActive: { backgroundColor: "#7d6c5eff" },
  segmentTxt: { color: "#fff", fontWeight: "700" },
  segmentTxtActive: { color: "#fff" },

  carouselRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  spyBubble: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  spyBubbleText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    letterSpacing: 3,
    textAlign: "center",
  },
  spyBubbleSub: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },

  dotsRow: { marginTop: 10, flexDirection: "row", gap: 6, alignSelf: "center" },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  dotActive: { backgroundColor: "#fff" },

  /* your original All / Orgs pill */

  activeTab: {
    backgroundColor: "#c09b6dff", // Snap-style orange or any color you want
    borderColor: "#71512aff",
  },
  tabText: { fontSize: 14, fontWeight: "600", color: "#333" },

  activeTabText: {
    color: "white",
  },

  //  image background fitting in the main page of homebase
  heroWrap: {
    width: "100%",
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
    // overflow: "hidden", // clips the image to rounded corners
    backgroundColor: "#eee",
  },

  hero: {
    width: "100%",
  },
  heroImage: {
    // resizeMode: "cover",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,

    // borderBottomLeftRadius: 24,
    // borderBottomRightRadius: 0,
  },
  heroOverlay: {
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.10)", // or 'rgba(0,0,0,0.12)' if your art is bright
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  heroInner: {
    flex: 1,
    // paddingTop: 24,
    paddingHorizontal: 24,
    justifyContent: "flex-start",
    paddingBottom: 55,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  spyBubbleWrap: {
    alignSelf: "center",
    position: "relative",
    marginTop: 20, // space above the bubble
    marginBottom: 6, // space below the bubble
    flexDirection: "row",
  },

  arrowAbs: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }], // vertically center near the bubble midline
    width: 40,
    height: 40, // bigger touch target
    alignItems: "center",
    justifyContent: "center",
    // optional: add a faint circle behind the arrow:
    // backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 20,
  },
  arrowLeft: { left: -44 }, // how tight the arrow sits next to the bubble
  arrowRight: { right: -44 }, // tweak -36..-52 to taste

  filterSearch: {
    width: 47,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    flexShrink: 0,
    flexGrow: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },

  //MY ORGS STICKY NOTE STYLES
  slotWrap: {
    width: "48%", // <-- was "47%": makes the card skinny
    marginBottom: 18,
  },
  slotLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 17,
    // optional pop:
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // make the All Posts card have a bit more bottom padding
  postCard: {
    paddingBottom: 20, // 👈 space under the bottom row
    shadowOpacity: 0.08,
  },

  // All Posts type
  postCity: { fontSize: 12, color: "#8a8a8a", marginBottom: 2 },
  postTitle: {
    fontSize: 16,
    fontWeight: "400", // 👈 not bold; change to "500" if you want a touch heavier
    lineHeight: 20,
    color: "#1f1f1f",
    marginBottom: 10,
  },
  postAgo: { fontSize: 12, color: "#7a7a7a" },

  postHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  avatar32: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  orgName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4b3d33",
    flexShrink: 1, // allow shrink when space is tight
    flexWrap: "wrap",
  },

  postBody: {
    fontSize: 16, // not bold
    lineHeight: 22,
    color: "#2a2a2a",
    marginTop: 2,
    marginBottom: 10,
  },
  postAgo: { fontSize: 12, color: "#8f7f72", marginBottom: 10 },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(75,61,51,0.25)",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: "#6b5b4b",
  },
  eyeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  eyeCount: { fontSize: 13, color: "#6b5b4b", fontWeight: "600" },

  // small label used by corkboard
  cityText: { fontSize: 12, color: "#7a7a7a", marginBottom: 4 },

  masonryRow: {
    flexDirection: "row",
    // alignItems: "flex-start",
    justifyContent: "space-between",
    // gap: 14, // horizontal space between the two columns
    paddingHorizontal: 12,
    overflow: "visible", // clips the edges of the cards
    paddingRight: 6,
  },
  col: { width: "48%" },
  colLeft: { marginLeft: -8 },
  colRight: { marginRight: -8 },
  cardsWrap: {
    marginHorizontal: -13,
    overflow: "visible",
  },
  avatar32: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.06)", // safe fallback
  },
});
