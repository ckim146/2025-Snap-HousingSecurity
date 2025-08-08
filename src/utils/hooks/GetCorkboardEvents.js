import { useEffect, useState } from "react";
import { supabase } from "./supabase"; // update if needed
import { useAuthentication } from "./useAuthentication"; // adjust import if needed

export default function useCorkboardEvents(selectedOrgId) {
  const [userOrgs, setUserOrgs] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthentication();

  useEffect(() => {
    const fetchUserOrgs = async () => {
      const { data, error } = await supabase
        .from("org_user_assignments")
        .select("org_id")
        .eq("user_id", user.id);
      if (!error) setUserOrgs(data);
    };

    fetchUserOrgs();
  }, []);

  useEffect(() => {
    if (!selectedOrgId) return;

    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("corkboard_entries")
        .select("*")
        .in("org_id", orgIds)
        .eq("user_id", user?.id);
      if (!error) setEntries(data);
      setLoading(false);
    };

    fetchEntries();
  }, [selectedOrgId]);

  return { userOrgs, entries, loading };
}
