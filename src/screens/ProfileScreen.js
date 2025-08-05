import { Image, Text, View, Button, StyleSheet, Pressable } from "react-native";
import { supabase } from "../utils/hooks/supabase";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { findAstrologySign } from "../utils/hooks/findAstrologySign";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import IonIcon from "react-native-vector-icons/Ionicons";

const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      // Handle successful sign out (e.g., redirect to login screen)
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuthentication();
  const [astrology, setAstrology] = useState("Pisces");
  const userSign = findAstrologySign();

  useEffect(() => {
    setAstrology(userSign.sign);
  }),
    [];

  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={{ uri: "https://i.imgur.com/FxsJ3xy.jpg" }}
        style={{ width: 150, height: 150, borderRadius: 150 / 2 }}
      />
      <Text
        style={{
          justifyContents: "center",
          textAlign: "center",
        }}
      >
        {user &&
          user.user_metadata &&
          user.user_metadata.email.slice(
            0,
            user.user_metadata.email.indexOf("@") // gets part before @ of email address, should use profile username instead
          )}
      </Text>
      <Button
        onPress={() => {
          navigation.navigate("Astrology");
        }}
        title={astrology}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />

      <Pressable
        style={styles.homebaseCard}
        onPress={() => {
          navigation.navigate("Homebase");
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View // Mini container for the icon
            style={{
              backgroundColor: "lightgrey",
              borderRadius: 20,
              padding: 10,
              marginRight: 8, // small space between icon and text
            }}
          >
            <IonIcon
              name="home-outline"
              size={32}
              color="purple"
              style={{ alignSelf: "center" }}
            />
          </View>
          <View //Mini container for the main text and subtext
            style={{ flexDirection: "column", justifyContent: "flex-start" }}
          >
            <Text style={[styles.cardHeader, { marginTop: 0 }]}>Homebase</Text>
            <Text style={{ fontSize: 12, color: "grey" }}>
              You're home.
            </Text>
          </View>
        </View>
        <View style={styles.newFeatureLabel}>
          <Text style={styles.newFeatureText}>New Feature</Text>
        </View>
        <Pressable //Arrow Icon
          onPress={() => navigation.navigate("Notifications")}
          style={{ marginLeft: "auto" }}
        >
          <IonIcon name="chevron-forward-outline" size={20} color="grey" />
        </Pressable>
      </Pressable>

      <Button onPress={handleSignOut} title="Log Out" />
      <Pressable>
        <Button
          onPress={() => {
            navigation.navigate("Settings", {});
          }}
          title="Settings"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  cardHeader: {
    fontSize: 17,
    textAlign: "center",
    paddingLeft: 0,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    alignItems: "center",
  },
  homebaseCard: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "white",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: "90%",
    height: "15%",
    alignSelf: "center",
    top: "5%",
    borderRadius: 20,
    paddingHorizontal: 20,
    // paddingTop: 12,
    paddingBottom: 0,
    // justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  newFeatureLabel: {
    // position: "absolute",
    // top: 20,
    // right: 50,
    marginLeft: "auto",
    marginRight: 10,
    backgroundColor: "#007BFF", // Blue
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  newFeatureText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
