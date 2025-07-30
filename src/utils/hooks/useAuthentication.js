import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useAuthentication() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve the current session

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchSession();

    // Set up an auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // console.log("USER", user)
  return { user };
}
