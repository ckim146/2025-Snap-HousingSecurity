import React from "react";
import "react-native-gesture-handler";
import "./src/utils/hooks/supabase";
// Importing Root Component
import RootNavigation from "./src/navigation/RootNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeBaseScreen from "./src/screens/HomeBaseScreen";
import { UserProvider } from "./src/components/UserContext";



export default function App() {
  return (
    <UserProvider>
    <SafeAreaProvider>
      <RootNavigation />
    </SafeAreaProvider>
    </UserProvider>
  );
}
