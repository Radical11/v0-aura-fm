import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  // Fetch profile data server-side
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, aura_type, total_ratings")
    .eq("id", user.id)
    .single();

  // Fetch ratings stats server-side
  const { data: ratings } = await supabase
    .from("ratings")
    .select("rating")
    .eq("user_id", user.id);

  const stats = {
    likes: ratings?.filter((r) => r.rating === "like").length || 0,
    okays: ratings?.filter((r) => r.rating === "okay").length || 0,
    skips: ratings?.filter((r) => r.rating === "skip").length || 0,
  };

  return <DashboardClient profile={profile} stats={stats} />;
}
