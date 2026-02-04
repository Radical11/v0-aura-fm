"use client";

import React from "react"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Sparkles,
  Music,
  Trophy,
  LogOut,
  Play,
  Moon,
  Zap,
  Heart,
  Guitar,
  User,
} from "lucide-react";

interface Profile {
  id: string;
  username: string | null;
  aura_type: string | null;
  total_ratings: number;
}

interface RatingStats {
  likes: number;
  okays: number;
  skips: number;
}

const auraIcons: Record<string, React.ReactNode> = {
  chill: <Moon className="h-6 w-6 text-blue-300" />,
  hype: <Zap className="h-6 w-6 text-orange-300" />,
  sad: <Heart className="h-6 w-6 text-pink-300" />,
  indie: <Guitar className="h-6 w-6 text-emerald-300" />,
  balanced: <Sparkles className="h-6 w-6 text-amber-300" />,
};

const auraEmojis: Record<string, string> = {
  chill: "🌊",
  hype: "🔥",
  sad: "💜",
  indie: "🎸",
  balanced: "✨",
};

const auraGradients: Record<string, string> = {
  chill: "from-blue-400 to-cyan-400",
  hype: "from-orange-400 to-yellow-400",
  sad: "from-pink-400 to-rose-400",
  indie: "from-emerald-400 to-teal-400",
  balanced: "from-amber-400 to-orange-400",
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<RatingStats>({ likes: 0, okays: 0, skips: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      const { data: ratingsData } = await supabase
        .from("ratings")
        .select("rating")
        .eq("user_id", user.id);

      if (ratingsData) {
        const likes = ratingsData.filter((r) => r.rating === "like").length;
        const okays = ratingsData.filter((r) => r.rating === "okay").length;
        const skips = ratingsData.filter((r) => r.rating === "skip").length;
        setStats({ likes, okays, skips });
      }

      setIsLoading(false);
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c0a14]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1025] via-[#0f0d18] to-[#0a0d1a]" />
        <div className="absolute -left-20 top-20 h-[400px] w-[400px] rounded-full bg-orange-500/20 blur-[150px]" />
        <div className="absolute -right-20 bottom-20 h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  const auraType = profile?.aura_type?.toLowerCase() || null;
  const totalRatings = profile?.total_ratings || 0;
  const gradient = auraType ? auraGradients[auraType] || auraGradients.balanced : "from-orange-400 to-yellow-400";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0c0a14]">
      {/* Vibrant background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1025] via-[#0f0d18] to-[#0a0d1a]" />
        <div className="absolute -left-20 top-10 h-[450px] w-[450px] rounded-full bg-orange-500/20 blur-[150px]" />
        <div className="absolute -right-20 top-1/3 h-[350px] w-[350px] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-10 left-1/4 h-[300px] w-[300px] rounded-full bg-yellow-500/15 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400 shadow-lg shadow-orange-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              aura.fm
            </span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </header>

        {/* Main content */}
        <div className="mx-auto mt-8 flex w-full max-w-4xl flex-1 flex-col gap-6 sm:mt-12">
          {/* Welcome section */}
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
              Welcome back
              {profile?.username && (
                <span className={`ml-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  {profile.username}
                </span>
              )}
            </h1>
            <p className="text-white/60">
              {auraType
                ? "Here's your music journey so far"
                : "Start rating songs to discover your aura"}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Aura Card */}
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:col-span-2">
              <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-3xl`} />
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20`} style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))` }}>
                    {auraType ? (
                      auraIcons[auraType] || auraIcons.balanced
                    ) : (
                      <User className="h-6 w-6 text-white/40" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Your Aura</p>
                    {auraType ? (
                      <p className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                        {auraType.charAt(0).toUpperCase() + auraType.slice(1)} {auraEmojis[auraType]}
                      </p>
                    ) : (
                      <p className="text-lg font-medium text-white/60">
                        Not discovered yet
                      </p>
                    )}
                  </div>
                </div>
                {auraType && (
                  <Link
                    href="/results"
                    className="text-sm text-orange-400 hover:text-orange-300"
                  >
                    View full results →
                  </Link>
                )}
              </div>
            </div>

            {/* Total Ratings */}
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-blue-500/20 blur-2xl" />
              <div className="relative">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                  <Music className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-sm text-white/50">Songs Rated</p>
                <p className="text-3xl font-bold text-white">{totalRatings}</p>
              </div>
            </div>

            {/* Likes */}
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-orange-500/20 blur-2xl" />
              <div className="relative">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
                  <span className="text-lg">🔥</span>
                </div>
                <p className="text-sm text-white/50">Songs Liked</p>
                <p className="text-3xl font-bold text-white">{stats.likes}</p>
              </div>
            </div>
          </div>

          {/* Rating breakdown */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Rating Breakdown
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-yellow-500/20">
                  <span>🔥</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.likes}</p>
                  <p className="text-sm text-white/50">Liked</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                  <span>😐</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.okays}</p>
                  <p className="text-sm text-white/50">Okay</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                  <span>❌</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.skips}</p>
                  <p className="text-sm text-white/50">Skipped</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/rate"
              className="group relative overflow-hidden rounded-[1.5rem] bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/25"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/20">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">
                    Rate More Songs
                  </h3>
                  <p className="text-sm text-black/70">
                    Discover new music and refine your aura
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/leaderboard"
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10"
            >
              <div className="relative flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                  <Trophy className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    View Leaderboard
                  </h3>
                  <p className="text-sm text-white/50">
                    See the most loved songs today
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
