import react from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  Pressable,
  useState,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { fontHeader } from "../../assets/themes/font";
import { colors } from "../../assets/themes/colors";
import { useNavigation } from "@react-navigation/native";
import Svg, { Text as SvgText } from "react-native-svg";


export default function DiscoverFeed() {
  const navigation = useNavigation();
  //  const [discoverCard, setDiscoverCard] = useState(false);
  //  const handlePress = () => {
  //   setDiscoverCard(true);
  // };

  // const handleClose = () => {
  //   setDiscoverCard(false);
  // };
  return (
    <View style={styles.FeedContainer}>
      <View style={styles.Square}>
        <Pressable
          onPress={() => {
            navigation.navigate("DiscoverCard");
          }}
        >
          <ImageBackground
            style={styles.FeedImage}
            imageStyle={{ borderRadius: 20 }}
            source={{
              uri: "https://eccles.utah.edu/wp-content/uploads/2017/02/snapchat.jpg",
            }}
          >
            <Svg height="100%" width="100%" style={styles.svgText}>
              <SvgText
              stroke="black"
              strokeWidth={.4}
              fill="white"
              fontSize="16"
              fontWeight="bold"
              x="100%"
              y="100%"
              textAnchor="end"
            > 
            My Name Is Chillahs
            </SvgText>

            </Svg>

            {/* <Text style={[styles.FeedText]}>Hello My Name Is Chillahs</Text> */}
          </ImageBackground>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  FeedContainer: {
    width: "100%",
    display: "flex",
    flex: 2,
    gap: 10,
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  Square: {
    display: "flex",

    flexDirection: "row",
    justifyContent: "space-around",
    gap: 20,
    width: "100%",
    alignItems: "center",
    // backgroundColor: "pink",
    alignItems: "center",
    borderRadius: 20,
    flexWrap: "wrap",
  },
  FeedImage: {
    width: 165,
    height: 320,
    display: "flex",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor:"blue",
    borderRadius:20,
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
    fontWeight: "900",
    fontSize: 14,
    color: "black",
    position: "absolute",
    right: 15,
    bottom: 15,
    textShadowColor: "#292929",

    textShadowRadius: 5,
    textShadowOpacity: 10,
  },
  svgText: {
    position: "absolute",
    bottom: 8,
    right: 3,
    // alignItems: 'center',
    // marginBottom: "25",
    // marginRight: "6"
  },
  smallFeedText: {},
});
