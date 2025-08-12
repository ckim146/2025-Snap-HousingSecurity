import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import UserTab from "./UserTab";
import ConversationScreen from "../screens/ConversationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddFriendScreen from "../screens/AddFriendScreen";
import DiscoverCard from "../components/DiscoverCard";
import SearchScreen from "../screens/SearchScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FriendStory from "../screens/FriendStory";
import AstrologyScreen from "../screens/AstrologyScreen";
import MemoryScreen from "../screens/MemoryScreen";
import EventScreen from "../screens/EventScreen"; //New component by Sona and Christian
import HomeBaseScreen from "../screens/HomeBaseScreen";
//added main page for Homebase
import HomeBaseMainPage from "../screens/HomeBaseMainPage";
import CorkBoardScreen from "../screens/CorkBoardScreen";
import MapInsideHomeBase from "../screens/MapInsideHomeBase";
import HomeBaseOnboardingScreen from "../screens/HomeBaseOnboardingScreen";
import MapScreen from "../screens/MapScreen";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UserTab" component={UserTab} />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="FriendStory"
          component={FriendStory}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="AddFriend"
          component={AddFriendScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Conversation"
          component={ConversationScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="DiscoverCard"
          component={DiscoverCard}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MemoryScreen"
          component={MemoryScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Astrology"
          component={AstrologyScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Event"
          component={EventScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Homebase"
          component={HomeBaseScreen}
          options={{headerShown: true,          // keep the header so you get the back button
    headerTransparent: true,    // remove the white background
    headerTitle: "", // remove the title
    headerTintColor: "#111",
    title: "My Orgs", presentation: "card",
    // headerStyle: { backgroundColor: "transparent" }, // for @react-navigation/stack
    // headerShadowVisible: false,
      headerStyle: { elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
  }}
        />

        <Stack.Screen
          name="HomebaseOnboarding"
          component={HomeBaseOnboardingScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CorkBoardScreen"
          component={CorkBoardScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="MapInsideHomeBase"
          component={MapInsideHomeBase}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>

      <Stack.Screen name="Map" component={MapScreen} />
    </NavigationContainer>
  );
}
