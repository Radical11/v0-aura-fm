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
  Star,
  Sun,
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
  Chill: <Moon className="h-6 w-6 text-purple-300" />,
  Energetic: <Zap className="h-6 w-6 text-yellow-300" />,
  Emotional: <Heart className="h-6 w-6 text-pink-300" />,
  Bold: <Star className="h-6 w-6 text-orange-300" />,
  Dreamy: <Sun className="h-6 w-6 text-blue-300" />,
};

const auraEmojis: Record<string, string> = {
  Chill: "🌙",
  Energetic: "⚡",
  Emotional: "💜",
  Bold: "🔥",
  Dreamy: "✨",
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

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // Fetch rating stats
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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0d1033]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  const auraType = profile?.aura_type || null;
  const totalRatings = profile?.total_ratings || 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0d1033]">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-[128px]" />
        <div className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-blue-600/20 blur-[128px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/15 blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white/90">
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
                <span className="ml-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
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
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:col-span-2">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    {auraType ? (
                      auraIcons[auraType] || <Moon className="h-6 w-6 text-purple-300" />
                    ) : (
                      <User className="h-6 w-6 text-white/40" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Your Aura</p>
                    {auraType ? (
                      <p className="text-2xl font-bold text-white">
                        {auraType} {auraEmojis[auraType]}
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
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    View full results →
                  </Link>
                )}
              </div>
            </div>

            {/* Total Ratings */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
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
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
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
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Rating Breakdown
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
                  <span>🔥</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.likes}</p>
                  <p className="text-sm text-white/50">Liked</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
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
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Rate More Songs
                  </h3>
                  <p className="text-sm text-white/70">
                    Discover new music and refine your aura
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/leaderboard"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10"
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
