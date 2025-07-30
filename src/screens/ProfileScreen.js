import { Image, Text, View, Button, StyleSheet, Pressable } from "react-native";
import { supabase } from "../utils/hooks/supabase";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { findAstrologySign } from "../utils/hooks/findAstrologySign";
import { useAuthentication } from "../utils/hooks/useAuthentication";

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
            user.user_metadata.email.indexOf("@"), // gets part before @ of email address, should use profile username instead
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
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    alignItems: "center",
  },
});
