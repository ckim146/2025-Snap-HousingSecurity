import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, TextInput, Image } from "react-native";
import { supabase } from "../utils/hooks/supabase";
import { useAuthentication } from "../utils/hooks/useAuthentication";

export default function SettingsScreen() {
  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("01/01/1998"); // Default random date
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [initialDisplayName, setInitialDisplayName] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingDateOfBirth, setEditingDateOfBirth] = useState(false);
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);

  useEffect(() => {
    if (user !== null) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles") // Replace with your table name
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setDisplayName(data.username || user.email.split("@")[0]);
      setEmail(data.email || user.email);
      setDateOfBirth(data.birthday || "01/01/1998");
      setProfilePictureUrl(
        data.avatar_url ||
          "https://image.cnbcfm.com/api/v1/image/100703713-Rubber%20duck%20in%20hk.jpg?v=1532564692&w=1600&h=900",
      ); // Default URL
      setInitialDisplayName(data.username || user.email.split("@")[0]);
      setInitialEmail(data.email || user.email);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setLoading(false);
    }
  };

  const saveProfilePicture = async () => {
    try {
      const { error } = await supabase
        .from("profiles") // Replace with your table name
        .update({ avatar_url: profilePictureUrl })
        .eq("id", user.id);

      if (error) throw error;

      setEditingProfilePicture(false);
      setProfilePictureUrl(profilePictureUrl);
    } catch (error) {
      console.error("Error updating profile picture URL:", error.message);
    }
  };

  const saveDisplayName = async () => {
    try {
      const { error } = await supabase
        .from("profiles") // Replace with your table name
        .update({ username: displayName })
        .eq("id", user.id);

      if (error) throw error;

      setEditingDisplayName(false);
      setInitialDisplayName(displayName);
    } catch (error) {
      console.error("Error updating display name:", error.message);
    }
  };

  const saveEmail = async () => {
    try {
      const { error } = await supabase
        .from("profiles") // Replace with your table name
        .update({ email })
        .eq("id", user.id);

      if (error) throw error;

      setEditingEmail(false);
      setInitialEmail(email);
    } catch (error) {
      console.error("Error updating email:", error.message);
    }
  };

  const saveDateOfBirth = async () => {
    try {
      const { error } = await supabase
        .from("profiles") // Replace with your table name
        .update({ birthday: dateOfBirth })
        .eq("id", user.id);

      if (error) throw error;

      setEditingDateOfBirth(false);
    } catch (error) {
      console.error("Error updating date of birth:", error.message);
    }
  };

  const cancelEditProfilePicture = () => {
    setProfilePictureUrl(profilePictureUrl);
    setEditingProfilePicture(false);
  };

  const cancelEditDisplayName = () => {
    setDisplayName(initialDisplayName);
    setEditingDisplayName(false);
  };

  const cancelEditEmail = () => {
    setEmail(initialEmail);
    setEditingEmail(false);
  };

  const cancelEditDateOfBirth = () => {
    setDateOfBirth("01/01/1998");
    setEditingDateOfBirth(false);
  };

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

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Settings</Text>

      {/* Profile Picture */}
      <View style={styles.settingBar}>
        <Text>Profile Picture</Text>
        {editingProfilePicture ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={profilePictureUrl}
              onChangeText={setProfilePictureUrl}
              placeholder="Enter profile picture URL"
            />
            <View style={styles.buttonContainer}>
              <Button onPress={saveProfilePicture} title="Save" />
              <Button onPress={cancelEditProfilePicture} title="Cancel" />
            </View>
          </View>
        ) : (
          <View style={styles.profilePictureContainer}>
            <Image
              source={{ uri: profilePictureUrl }}
              style={styles.profilePicture}
            />
            <Button
              onPress={() => setEditingProfilePicture(true)}
              title="Edit"
            />
          </View>
        )}
      </View>

      {/* Display Name */}
      <View style={styles.settingBar}>
        <Text>Display Name</Text>
        {editingDisplayName ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your display name"
            />
            <View style={styles.buttonContainer}>
              <Button onPress={saveDisplayName} title="Save" />
              <Button onPress={cancelEditDisplayName} title="Cancel" />
            </View>
          </View>
        ) : (
          <Text style={styles.databaseData}>{displayName}</Text>
        )}
        {!editingDisplayName && (
          <Button onPress={() => setEditingDisplayName(true)} title="Edit" />
        )}
      </View>

      {/* Email */}
      <View style={styles.settingBar}>
        <Text>Email</Text>
        {editingEmail ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
            />
            <View style={styles.buttonContainer}>
              <Button onPress={saveEmail} title="Save" />
              <Button onPress={cancelEditEmail} title="Cancel" />
            </View>
          </View>
        ) : (
          <Text style={styles.databaseData}>{email}</Text>
        )}
        {!editingEmail && (
          <Button onPress={() => setEditingEmail(true)} title="Edit" />
        )}
      </View>

      {/* Date of Birth */}
      <View style={styles.settingBar}>
        <Text>Date of Birth</Text>
        {editingDateOfBirth ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="MM/DD/YYYY"
            />
            <View style={styles.buttonContainer}>
              <Button onPress={saveDateOfBirth} title="Save" />
              <Button onPress={cancelEditDateOfBirth} title="Cancel" />
            </View>
          </View>
        ) : (
          <Text style={styles.databaseData}>{dateOfBirth}</Text>
        )}
        {!editingDateOfBirth && (
          <Button onPress={() => setEditingDateOfBirth(true)} title="Edit" />
        )}
      </View>

      {/* Log Out Button */}
      <Button onPress={handleSignOut} title="Log Out" style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 15,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  settingBar: {
    marginTop: 10,
  },
  databaseData: {
    color: "grey",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});
