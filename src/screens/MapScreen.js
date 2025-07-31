import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../utils/hooks/supabase";
import { TAB_BAR_PADDING } from "../navigation/UserTab";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocationCard } from "../components/LocationCard";

import Ionicons from "react-native-vector-icons/Ionicons";
import { Button } from "@rn-vui/base";
import {LocationCard} from "../components/LocationCard";

export default function MapScreen({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [homeBaseMode, setHomeBaseMode] = useState(false);

  const [currentRegion, setCurrentRegion] = useState({
    latitude: 34.0211573,
    longitude: -118.4503864,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const defaultPivotCategories = [
    {
      title: "Memories",
      icon: "images-outline",
    },
    {
      title: "Visited",
      icon: "checkmark-circle-outline",
    },
    {
      title: "Popular",
      icon: "flame-outline",
    },
    {
      title: "Favorites",
      icon: "heart-outline",
    },
    {
      title: "Restaurants",
      icon: "restaurant-outline",
    },
    {
      title: "Cafes",
      icon: "cafe-outline",
    },
    {
      title: "Parks",
      icon: "leaf-outline",
    },
    {
      title: "Shops",
      icon: "cart-outline",
    },
  ];

  const homeBasePivotCategories = [
    {
      title: "Shelters",
      icon: "home-outline",
    },
    {
      title: "Showers",
      icon: "water-outline",
    },
    {
      title: "Parking",
      icon: "car-outline",
    },
    {
      title: "Bathrooms",
      icon: "male-female-outline",
    },
    {
      title: "Food",
      icon: "restaurant-outline",
    },
    {
      title: "Clothing",
      icon: "shirt-outline",
    },
  ];

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("resource_locations")
        .select("*");
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Fetched data:", data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("Location:", location);
      setLocation(location);
      setCurrentRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      fetchData();
      console.log("tabBarHeight:", tabBarHeight, "insets.bottom:", insets.bottom);
    })();
  }, []);

  let text = "Waiting...";
  text = JSON.stringify(location);

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View
      style={[
        styles.container,
        {
          position: "absolute",
        },
      ]}
    >
      <MapView
        style={styles.map}
        region={currentRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      />
  {/* <LocationCard
        isVisible={true}
        onClose={() => console.log("LocationCard closed")}
        location={location}
        currentRegion={currentRegion}
        setCurrentRegion={setCurrentRegion}
        style={styles.locationCard}
      /> */}
      <View style={[styles.locationCard, { backgroundColor: "red" }]}>
  <Text>Test Card</Text>
</View>
      <View style={styles.homeBaseToggleButton}>
        <Button
          title={homeBaseMode ? "Exit Home Base Mode" : "Enter Home Base Mode"}
          onPress={() => setHomeBaseMode(!homeBaseMode)}
        />
      </View>

      <View style={[styles.mapFooter, { bottom: tabBarHeight - insets.bottom + TAB_BAR_PADDING }]}>
        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={[styles.userLocation, styles.shadow]}
            onPress={() => {
              console.log("Go to user location!");
              const { latitude, longitude } = location.coords;
              setCurrentRegion({ ...currentRegion, latitude, longitude });
            }}
          >
            <Ionicons name="navigate" size={15} color="black" />
          </TouchableOpacity>
        </View>
        <View style={[styles.bitmojiContainer, styles.shadow]}>
          <Pressable
            onPress={() => {
              navigation.navigate("Event");
            }}
          >
            <View style={styles.myBitmoji}>
              <Ionicons name="calendar-outline" size={50} color="gray" />
              <View style={styles.bitmojiTextContainer}>
                <Text style={styles.bitmojiText}>Events</Text>
              </View>
            </View>
          </Pressable>

          <View style={styles.places}>
            <Image
              style={styles.bitmojiImage}
              source={require("../../assets/snapchat/personalBitmoji.png")}
            />
            <View style={styles.bitmojiTextContainer}>
              <Text style={styles.bitmojiText}>Places</Text>
            </View>
          </View>
          <View style={styles.myFriends}>
            <Image
              style={styles.bitmojiImage}
              source={require("../../assets/snapchat/personalBitmoji.png")}
            />
            <View style={styles.bitmojiTextContainer}>
              <Text style={styles.bitmojiText}>Friends</Text>
            </View>
          </View>
        </View>
                <ScrollView
          horizontal
          contentContainerStyle={{ paddingHorizontal: 20 }}
          style={styles.pivotScrollView}
        >
          {(homeBaseMode
            ? homeBasePivotCategories
            : defaultPivotCategories
          ).map((pivot) => (
            <Pressable
              style={styles.pivot}
              onPress={() => {
                console.log(`Pivot: ${pivot.title}`);
              }}
            >
              <Ionicons name={pivot.icon} size={20} color="black" />
              <Text style={styles.pivotText}>{pivot.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    // position: "relative",
  },
  mapFooter: {
position: "absolute",

  // bottom: TAB_BAR_PADDING,
  left: 0,
  right: 0,
  zIndex: 5,
  backgroundColor: "transparent",
  // paddingBottom: 10,
  },
  map: {
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    width: "100%",
    height: "100%",
    flex: 1,
  },
  locationContainer: {
    backgroundColor: "transparent",
    width: "100%",
    // paddingBottom: 8,
    alignItems: "center",
  },
  userLocation: {
    backgroundColor: "white",
    borderRadius: 100,
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  shadow: {
    shadowColor: "rgba(0, 0, 0)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 3,
    shadowOpacity: 0.5,
    elevation: 4,
  },
  bitmojiContainer: {
    flexDirection: "row",
    marginBottom: 8,
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  myBitmoji: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  bitmojiImage: {
    width: 50,
    height: 50,
  },
  bitmojiTextContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 4,
  },
  bitmojiText: {
    fontSize: 10,
    fontWeight: "700",
  },
  places: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  myFriends: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarIcon: {},
  pivot: {
    // width: 30,
    // height: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginHorizontal: 5,
    flexDirection: "row",
  },
  pivotScrollView: {
    backgroundColor: "white",
    paddingVertical: 10,
    maxHeight: 60,
  },
  pivotText: {
    marginLeft: 8,
    fontSize: 14,
    color: "black",
  },
  homeBaseToggleButton: {
    position: "absolute",
    top: 50,
    left: 10,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    margin: 10,
    alignSelf: "flex-start",
    zIndex: 10,
  },
  locationCard: {
        position: "absolute",
        top: 150,
        left: 10,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        zIndex: 999,
        elevation: 10,
      }
});
