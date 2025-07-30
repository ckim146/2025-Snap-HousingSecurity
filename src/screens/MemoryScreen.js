import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { fontHeader } from "../../assets/themes/font";
import { colors } from "../../assets/themes/colors";
import StoriesBitmoji from "../components/StoriesBitmoji";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../utils/hooks/supabase";
import MemoryCard from "../components/MemoryCard";

import Header from "../components/Header";

/* Discover FlatList will render a component in the list
 * for each object in the array DATA. This is just an example I took
 * from the FlatList documentation, so feel free to change the contents.
 */

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

export default function MemoryScreen({ route, navigation }) {
  //   const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  let [galleryPhotos, setGalleryPhotos] = useState([]);

  useEffect(() => {
    const fetchGalleryPhotos = async () => {
      try {
        const { data: galleryPhotos, error } = await supabase
          .from("gallery")
          .select("photo");
        if (error) {
          console.error("Error fetching gallery photos:", error);
        } else {
          setGalleryPhotos(galleryPhotos);
          // console.log(galleryPhotos);
        }
      } catch (error) {
        console.error("Error fetching photos", error.message);
      }
    };
    fetchGalleryPhotos();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          // Paddings to handle safe area
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          //   marginBottom: tabBarHeight,
        },
      ]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.storyBar}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stories}
          ></ScrollView>
        </View>
        <View style={styles.discoverContent}>
          <Text style={styles.sectionHeader}>Memories</Text>

          <FlatList
            data={galleryPhotos}
            horizontal={false}
            numColumns={2}
            ItemSeparatorComponent={() => <View style={{ height: "1%" }} />}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => <MemoryCard imageUri={item.photo} />}
            keyExtractor={(item) => item.id}
          />
          {/* galleryPhotos.map((p)=>p.photo) */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  storyBar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
  },
  discoverContent: {
    display: "flex",
    flexDirection: "column",
  },
  stories: {
    display: "flex",
    gap: 12,
    width: "100%",
  },
  DiscoveryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sectionHeader: {
    textAlign: "left",
    paddingVertical: 4,
    color: colors.primary,
    fontSize: fontHeader.fontSize,
    fontFamily: fontHeader.fontFamily,
    fontWeight: fontHeader.fontWeight,
  },
});
