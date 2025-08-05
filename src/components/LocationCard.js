import React from "react";
import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../utils/hooks/supabase";
import { Dialog, FAB } from "@rn-vui/themed";
//import BottomSheet from "@gorhom/bottom-sheet";

export default function LocationCard({ isVisible, onClose, style }) {
  const [title, setTitle] = useState("");
  const [descr, setDescr] = useState("");
  const [hours, setHours] = useState("");
  const [location, setLocation] = useState("");
  const [imageURL, setImageURL] = useState("");

  const [event, setEvent] = useState({});

  const fallbackImageURL =
    "https://interactive-examples.mdn.mozilla.net/media/examples/plumeria.jpg";

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["25%", "75%"], []);

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
  //we want to use this function to send information to Supabse when Submit button is clicked
  function submitToSupabase() {
    const validImageURL = isValidUrl(imageURL) ? imageURL : fallbackImageURL;

    let object = {
      id: btoa(title + time + new Date().toISOString()),
      title: title,
      description: descr,
      time: time,
      location: location,
      host: "someUsername",
      imageURL: validImageURL,
      attending: 0,
      private: false,
      created_at: new Date().toISOString(),
    };
    return object;
  }

  const insertData = async () => {
    if (title != "" && time != "" && location != "") {
      const eventData = submitToSupabase();
      console.log(eventData);

      onClose();
      try {
        const { data, error } = await supabase
          .from("event_table") //
          .insert([eventData]); // Insert the event data

        if (error) {
          console.error("Event already exists:", error);
        } else {
          console.log("Data inserted:", data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 1 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={handleClose}
    >
      <View style={[styles.container, style]}>
        <Text style={styles.eventText}>Event Details</Text>
        <TextInput
          onChangeText={setTitle}
          style={styles.inputFields}
          placeholder="Title (required)"
        />
        <TextInput
          onChangeText={setDescr}
          style={styles.descriptionField}
          placeholder="Description"
          multiline
        />
        <TextInput
          onChangeText={setTime}
          style={styles.inputFields}
          placeholder="Time (required)"
        />
        <TextInput
          onChangeText={setLocation}
          style={styles.inputFields}
          placeholder="Location (required)"
        />
        <TextInput
          onChangeText={setImageURL}
          style={styles.inputFields}
          placeholder="Picture Url"
        />

        <FAB
          icon={{ name: "upload", color: "white" }}
          style={styles.uploadButton}
          title="Upload Picture"
          color="#65BEFF"
        />
        <FAB
          style={styles.uploadButton}
          title="Submit"
          onPress={insertData}
          color="#289CF1"
        />
      </View>
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  userInfo: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "yellow",
    width: "80%",
    // aspectRatio: 1,
    position: "absolute",
    alignSelf: "center",
    top: "20%",
    borderRadius: 20,
    padding: 20,
  },
  DialogueBox: {
    // height: "60%",
    borderRadius: 20,
  },
  eventText: {
    textAlign: "center",
    fontSize: 23,
    fontWeight: "bold",
  },
  inputFields: {
    marginTop: 10,
    backgroundColor: "#F0F0F0",
    padding: 8,
    borderRadius: 5,
  },
  descriptionField: {
    marginTop: 10,
    backgroundColor: "#F0F0F0",
    padding: 8,
    borderRadius: 5,
    paddingBottom: 30,
  },
  otherButtons: {
    backgroundColor: "yellow",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  uploadButton: {
    marginTop: 16,
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});
