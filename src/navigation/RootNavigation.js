import React from "react";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import AuthStack from "./AuthStack";
import UserStack from "./UserStack";
import supabase from "../utils/hooks/supabase";

export default function RootNavigation() {
  const { user } = useAuthentication();

  if (!user && process.env.EXPO_PUBLIC_ENVIRONMENT === "dev") {
    devAutoLogin();
  }

  return user ? <UserStack /> : <AuthStack />;
}

async function devAutoLogin() {
  // console.log("Developer environment, signing in automatically");

  // Only works if you make a file called ".env" with contents:
  // EXPO_PUBLIC_ENVIRONMENT=dev
  // EXPO_PUBLIC_DEV_EMAIL=youremail
  // EXPO_PUBLIC_DEV_PASSWORD=yourpassword

  const { user, error } = await supabase.auth.signInWithPassword({
    email: process.env.EXPO_PUBLIC_DEV_EMAIL,
    password: process.env.EXPO_PUBLIC_DEV_PASSWORD,
  });

  if (error) {
    console.error("Error logging in:", error.message);
  } else {
    // console.log("User signed in:", user);
  }
}
