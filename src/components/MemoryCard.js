import react, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { fontHeader } from "../../assets/themes/font";
import { colors } from "../../assets/themes/colors";
import { useNavigation } from "@react-navigation/native";

export default function MemoryPhoto({ imageUri }) {
  const navigation = useNavigation();

  // console.log("Uri is: ", imageUri);
  return (
    <View style={styles.Square}>
      {/* <Pressable onPress={() => console.log("I was clicked")}> */}
      <Pressable
        onPress={() => {
          navigation.navigate("MemoryCard");
        }}
      >
        <ImageBackground
          style={styles.FeedImage}
          imageStyle={{ borderRadius: 0 }}
          source={{
            uri: imageUri,
          }}
        ></ImageBackground>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  FeedContainer: {
    paddingLeft: 20,
    width: "100%",
  },
  Square: {
    width: "49%",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  FeedImage: {
    width: 180,
    height: 320,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  FeedText: {
    padding: 8,
    fontWeight: "700",
    fontSize: 14,
    color: "white",
    position: "absolute",
    right: 15,
    bottom: 15,
    textShadowColor: "#000",
    textShadowOffset: {
      width: -1,
      height: -1,
    },
    textShadowRadius: 1,
    textShadowOpacity: 1,
  },
  smallFeedText: {},
});
