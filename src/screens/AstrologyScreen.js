import { Image, Text, View, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { findAstrologySign } from "../utils/hooks/findAstrologySign";

const requestOptions = {
  method: "GET",
  redirect: "follow",
};

const zodiacImages = {
  Aquarius: require("../../assets/sign-images/aquarius.png"),
  Aries: require("../../assets/sign-images/aries.png"),
  Cancer: require("../../assets/sign-images/cancer.png"),
  Capricorn: require("../../assets/sign-images/capricorn.png"),
  Gemini: require("../../assets/sign-images/gemini.png"),
  Leo: require("../../assets/sign-images/leo.png"),
  Libra: require("../../assets/sign-images/libra.png"),
  Pisces: require("../../assets/sign-images/pisces.png"),
  Sagittarius: require("../../assets/sign-images/sagittarius.png"),
  Scorpio: require("../../assets/sign-images/scorpio.png"),
  Taurus: require("../../assets/sign-images/taurus.png"),
  Virgo: require("../../assets/sign-images/virgo.png"),
};

export default function AstrologyScreen() {
  const [astrology, setAstrology] = useState(null);
  const [horoscope, setHoroscope] = useState();
  const [signAbout, setSignAbout] = useState();
  const [signElement, setSignElement] = useState();
  const [signCompatibility, setSignCompatibility] = useState();
  const userSign = findAstrologySign();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    setAstrology(userSign.sign);
    setImageUrl(zodiacImages[userSign.sign]);
  }),
    [];

  useEffect(() => {
    if (astrology === null) return;
    getHoroscope();
    getSignDescription();
  }),
    [astrology];

  async function getHoroscope() {
    fetch(
      `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${astrology}&day=TODAY`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => setHoroscope(result.data.horoscope_data))
      .catch((error) => console.error(error));
  }

  async function getSignDescription() {
    const myHeaders = new Headers();
    myHeaders.append("x-rapidapi-host", "horoscope-astrology.p.rapidapi.com");
    myHeaders.append("x-rapidapi-key", process.env.EXPO_PUBLIC_X_RAPIDAPI_KEY);

    const url = `https://horoscope-astrology.p.rapidapi.com/sign?s=${astrology.toLowerCase()}`;
    const options = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((result) => {
        setSignAbout(result.about.split(`\n`)[0]);
        setSignElement(result.element);
        setSignCompatibility(result.compatibility);
      })
      .catch((error) =>
        console.error(
          "RapidAPI key failure. Please contact Bee on Slack for more info.",
        ),
      );
  }

  return (
    <ScrollView style={{ backgroundColor: "purple" }}>
      <View style={styles.page}>
        <Image source={imageUrl} />
        <Text style={styles.sign}>{astrology}</Text>
        <Text style={styles.contentTitles}>Today's Horoscope</Text>
        <Text style={styles.contentText}>{horoscope}</Text>
        <Text style={styles.contentTitles}>About</Text>
        <Text style={styles.contentText}>{signAbout}</Text>
        <Text style={styles.contentTitles}>Element</Text>
        <Text style={styles.contentText}>{signElement}</Text>
        <Text style={styles.contentTitles}>Compatible Signs</Text>
        <Text style={styles.contentText}>{signCompatibility}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "purple",
    alignItems: "center",
    paddingTop: 25,
    margin: 20,
  },
  contentTitles: {
    justifyContents: "center",
    fontFamily: "Papyrus",
    fontWeight: "bold",
    fontSize: 30,
    color: "gold",
  },
  sign: {
    paddingTop: 0,
    paddingBottom: 30,
    fontFamily: "Papyrus",
    fontSize: 40,
    color: "lightyellow",
  },
  contentText: {
    paddingTop: 30,
    paddingBottom: 30,
    fontFamily: "Papyrus",
    fontSize: 18,
    color: "lightyellow",
  },
});
