import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { supabase } from "../utils/hooks/supabase";

// Components
import ReturnButton from "../components/ReturnButton";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(0);

  async function handleSubmit() {
    // console.log("handle submit invoked!!");

    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
    } else {
      // console.log("User signed in:", user);
      // Navigate to a different screen or handle successful login
    }
  }

  return (
    <View style={styles.logInScreen}>
      <ReturnButton navigation={navigation} returnName="AuthHome" />
      <Text style={styles.logInTitle}>Log In</Text>
      <View style={styles.logInFields}>
        <Text style={styles.inputText}>USERNAME OR EMAIL</Text>
        <TextInput
          style={styles.inputField}
          secureTextEntry={false}
          autoCapitalize="none"
          onChangeText={(email) => setEmail(email)}
        />
        <Text style={styles.inputText}>PASSWORD</Text>
        <TextInput
          style={styles.inputField}
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={(password) => {
            setPassword(password);
            setPasswordLength(password.length);
          }}
        />
      </View>
      {passwordLength >= 4 && (
        <TouchableOpacity style={styles.logInBtn} onPress={handleSubmit}>
          <Text style={styles.logInText}>Log In</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logInScreen: {
    backgroundColor: "#FFF",
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  logInTitle: {
    position: "absolute",
    top: 150,
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 2,
  },
  logInFields: {
    width: 250,
    height: 80,
    position: "absolute",
    top: 200,
  },
  inputText: {
    marginBottom: 20,
    color: "#b1b1b1",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  inputField: {
    borderBottomColor: "#aeb5bf",
    borderBottomWidth: 1,
    marginBottom: 20,
    fontWeight: "600",
  },
  logInBtn: {
    padding: 15,
    backgroundColor: "#65b5ff",
    width: 250,
    alignItems: "center",
    borderRadius: 25,
    position: "absolute",
    bottom: 25,
  },
  logInText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
});
