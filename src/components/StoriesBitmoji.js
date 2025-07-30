import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { fontHeader } from "../../assets/themes/font";
import { colors } from "../../assets/themes/colors";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

// import StoriesBitmoji from "../components/StoriesBitmoji";

import Header from "../components/Header";

export default function StoriesBitmoji() {
  const navigation = useNavigation();
  return (
    <View style={styles.myBitmoji}>
      <Pressable //added a presable to give the story interaction
        style={[styles.profile, styles.buttons]}
        onPress={() => {
          navigation.navigate("FriendStory");
        }}
      >
        <Image
          style={styles.bitmojiImage}
          source={require("../../assets/snapchat/personalBitmoji.png")}
        />
      </Pressable>
      <View style={styles.bitmojiTextContainer}>
        <Text style={styles.bitmojiText}>Name</Text>
        <Text style={styles.usernameText}>Username</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  myBitmoji: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
  },
  bitmojiImage: {
    width: 60,
    height: 60,
  },
  bitmojiTextContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 4,
  },
  bitmojiText: {
    alignSelf: "center",
    fontSize: 12,
    fontWeight: "700",
  },
  usernameText: {
    fontSize: 8,
    fontWeight: "700",
    opacity: 0.5,
  },
  Friends: {
    textAlign: "left",
    paddingLeft: 20,
    paddingBottom: 20,
    color: colors.primary,
    fontSize: fontHeader.fontSize,
    fontFamily: fontHeader.fontFamily,
    fontWeight: fontHeader.fontWeight,
  },
});
