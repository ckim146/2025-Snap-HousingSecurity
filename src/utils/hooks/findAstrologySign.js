import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuthentication } from "./useAuthentication";

const zodiac = [
  ["Capricorn", "Aquarius"],
  ["Aquarius", "Pisces"],
  ["Pisces", "Aries"],
  ["Aries", "Taurus"],
  ["Taurus", "Gemini"],
  ["Gemini", "Cancer"],
  ["Cancer", "Leo"],
  ["Leo", "Virgo"],
  ["Virgo", "Libra"],
  ["Libra", "Scorpio"],
  ["Scorpio", "Sagittarius"],
  ["Sagittarius", "Capricorn"],
];

export function findAstrologySign() {
  const [birthday, setBirthday] = useState("git");
  const [sign, setSign] = useState("");
  const { user } = useAuthentication();

  useEffect(() => {
    async function fetchUserBirthday() {
      if (user === null) {
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("birthday")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log("Birthday fetch failure");
      } else if (data.birthday) {
        setBirthday(data.birthday.split("/").slice(0, 2));
      }
    }

    fetchUserBirthday();
  }, [user]);

  //   determine the sign based on birthday
  useEffect(() => {
    const zodiacSigns = [
      { month: "01", cutoffDay: 20, signs: [zodiac[0][0], zodiac[0][1]] },
      { month: "02", cutoffDay: 19, signs: [zodiac[1][0], zodiac[1][1]] },
      { month: "03", cutoffDay: 21, signs: [zodiac[2][0], zodiac[2][1]] },
      { month: "04", cutoffDay: 20, signs: [zodiac[3][0], zodiac[3][1]] },
      { month: "05", cutoffDay: 21, signs: [zodiac[4][0], zodiac[4][1]] },
      { month: "06", cutoffDay: 21, signs: [zodiac[5][0], zodiac[5][1]] },
      { month: "07", cutoffDay: 23, signs: [zodiac[6][0], zodiac[6][1]] },
      { month: "08", cutoffDay: 23, signs: [zodiac[7][0], zodiac[7][1]] },
      { month: "09", cutoffDay: 23, signs: [zodiac[8][0], zodiac[8][1]] },
      { month: "10", cutoffDay: 23, signs: [zodiac[9][0], zodiac[9][1]] },
      { month: "11", cutoffDay: 22, signs: [zodiac[10][0], zodiac[10][1]] },
      { month: "12", cutoffDay: 22, signs: [zodiac[11][0], zodiac[11][1]] },
    ];

    const birthMonth = birthday[0];
    const birthDay = parseInt(birthday[1]);

    const zodiacSign = zodiacSigns.find((sign) => sign.month === birthMonth);
    if (zodiacSign) {
      setSign(
        birthDay <= zodiacSign.cutoffDay
          ? zodiacSign.signs[0]
          : zodiacSign.signs[1],
      );
    }
  }, [birthday]);

  return { sign };
}
