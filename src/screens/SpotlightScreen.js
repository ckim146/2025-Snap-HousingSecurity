import React, { useEffect } from "react";
import { FlatList, Image, StyleSheet } from "react-native";

const RAWDATA = [
  {
    id: "https://cdn2.psychologytoday.com/assets/styles/manual_crop_16_9_1200x675/public/teaser_image/blog_entry/2023-01/kitty.green66--2.jpg?itok=5rgu2CRx",
    title: "First Item",
  },
  {
    id: "https://i0.wp.com/sitn.hms.harvard.edu/wp-content/uploads/2017/12/puppykitty.jpg?fit=720%2C405&ssl=1",
    title: "Second Item",
  },
  {
    id: "https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F31cd9f59-3c4a-4159-a46c-b93e2c502b6b.jpg?crop=2916%2C2825%2C0%2C451",
    title: "Third Item",
  },
  {
    id: "https://www.onegreenplanet.org/wp-content/uploads/2023/08/shutterstock_2026045151-scaled-e1692203409763.jpg",
    title: "Fourth Item",
  },
];
const DATA = []
//plan
//make a function using useEffect (so that it happens on load)
//the function will take iterate through RAWDATA 
  //when iterating check if the id will give a valid 200
  //if so append that element to DATA
  //at end of iterations, data, now only has good urls


  async function filterValidImages(imageList) {

  for (const element of imageList) {
    const URL = element.id
    if (await isValidImage(URL)) {
      DATA.push(element);
    }
  }
}

async function isValidImage(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' }); // Only checks headers
    return response.ok;
  } catch (err) {
    return false; // Network error or invalid URL
  }
}

const renderItem = ({ item }) => {
  return <Image style={styles.image} source={{ uri: item.id }} />;
};

export default function SpotlightScreen() {
    useEffect(() => {
      console.log("useEffect ran");
      filterValidImages(RAWDATA);
    }
  );
  return (
    <FlatList
      contentContainerStyle={styles.container}
      pagingEnabled={true}
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    padding: 20,
  },
  image: {
    height: 800,
  },
});
