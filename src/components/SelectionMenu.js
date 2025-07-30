import React, { useState } from "react";
import { BottomSheet, Button, ListItem } from "@rn-vui/themed";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation} from '@react-navigation/native';


const SelectionMenu = ({ showMenu, setShowMenu }) => {
  // const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigation();
  const list = [
    {
      title: "New Chat",
      onPress: () => {
        navigation.navigate("Conversation");
        setShowMenu(false);

      },
    },
    { title: "New Shortcut" },
    { title: "Manage Chats" },
    { title: "Manage Friendships" },
    { title: "Customize Best Friend Emojis" },
    {
      title: "Done",
      containerStyle: { backgroundColor: "red" },
      titleStyle: { color: "white" },
      onPress: () => setShowMenu(false),
    },

    
  ];
  //console.log("showmenu", showMenu);
  
  // if (showMenu) {
  return (
    // <SafeAreaProvider>
    //   <Button
    //     title="Open Bottom Sheet"
    //     onPress={() => setIsVisible(true)}
    //     buttonStyle={styles.button}
    //   />
    <BottomSheet modalProps={{}} isVisible={showMenu}>
      {list.map((l, i) => (
        <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
          <ListItem.Content>
            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
    // </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
});
// }

export default SelectionMenu;
