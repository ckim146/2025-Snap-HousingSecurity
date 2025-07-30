import { Image, Text, View } from "react-native";

export default function FriendStory() {
  return (
    <View styles={{ alignItems: "center" }}>
      <Image
        source={{
          uri: "https://th-thumbnailer.cdn-si-edu.com/GVQMy9vcT75WbeOYRLkMaJQfVWw=/800x800/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/20110520085955turkey1.jpg",
        }}
        style={{ width: 800, height: 800 }}
      />
      {/* <Text 
        styles={{justifyContents:"center"}}>
        This would be your friends story!!!
    </Text> */}
    </View>
  );
}
