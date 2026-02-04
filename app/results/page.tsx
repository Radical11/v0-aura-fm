"use client";

import React from "react"

import { useEffect, useState } from "react";
import {
  Sparkles,
  Moon,
  Music,
  ChevronRight,
  Share2,
  Zap,
  Heart,
  Star,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Profile {
  aura_type: string | null;
  total_ratings: number;
  username: string | null;
}

const auraIcons: Record<string, React.ReactNode> = {
  Chill: <Moon className="h-12 w-12 text-purple-300 sm:h-14 sm:w-14" />,
  Energetic: <Zap className="h-12 w-12 text-yellow-300 sm:h-14 sm:w-14" />,
  Emotional: <Heart className="h-12 w-12 text-pink-300 sm:h-14 sm:w-14" />,
  Bold: <Star className="h-12 w-12 text-orange-300 sm:h-14 sm:w-14" />,
  Dreamy: <Sun className="h-12 w-12 text-blue-300 sm:h-14 sm:w-14" />,
};

const auraDescriptions: Record<string, string> = {
  Chill:
    "You vibe with laid-back beats, dreamy melodies, and late-night soundscapes. Your music taste is effortlessly cool and introspective.",
  Energetic:
    "You're all about high-energy tracks that get you moving! Upbeat rhythms and powerful drops are your jam.",
  Emotional:
    "You connect deeply with music that tells a story. Heartfelt lyrics and soulful melodies speak to your heart.",
  Bold:
    "You're drawn to unique and unconventional sounds. Your playlist is full of tracks that make a statement.",
  Dreamy:
    "You love atmospheric and ethereal music. Ambient textures and floating melodies create your perfect soundtrack.",
};

const auraEmojis: Record<string, string> = {
  Chill: "🌙",
  Energetic: "⚡",
  Emotional: "💜",
  Bold: "🔥",
  Dreamy: "✨",
};

export default function ResultsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
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
        .select("aura_type, total_ratings, username")
        .eq("id", user.id)
        .single();

      setProfile(profileData);
      setIsLoading(false);
    };

    fetchProfile();
  }, [router]);

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0d1033]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <p className="text-white/60">Loading your aura...</p>
        </div>
      </main>
    );
  }

  const auraType = profile?.aura_type || "Chill";
  const songsRated = profile?.total_ratings || 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0d1033]">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-[128px]" />
        <div className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-blue-600/20 blur-[128px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/15 blur-[100px]" />
        <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px]" />
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
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Logo */}
        <div className="absolute left-4 top-6 sm:left-8">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Sparkles className="h-4 w-4 text-white" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 opacity-60 blur-md" />
            </div>
            <span className="text-base font-semibold tracking-tight text-white/90">
              aura.fm
            </span>
          </Link>
        </div>

        {/* Main Glass Card */}
        <div className="relative w-full max-w-md">
          {/* Animated glow ring */}
          <div
            className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-violet-500/30 blur-3xl"
            style={{
              animation: "glow-pulse 4s ease-in-out infinite",
            }}
          />

          {/* Secondary glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 blur-xl" />

          {/* Main glass card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
            {/* Inner highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5" />

            {/* Content */}
            <div className="relative flex flex-col items-center text-center">
              {/* Aura Icon */}
              <div className="relative mb-6">
                {/* Icon glow */}
                <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 blur-2xl" />

                {/* Icon container */}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm sm:h-28 sm:w-28">
                  {auraIcons[auraType] || auraIcons.Chill}

                  {/* Animated ring */}
                  <div
                    className="absolute -inset-1 rounded-full border-2 border-purple-500/30"
                    style={{
                      animation: "spin-slow 20s linear infinite",
                    }}
                  />
                  <div
                    className="absolute -inset-3 rounded-full border border-blue-500/20"
                    style={{
                      animation: "spin-slow 30s linear infinite reverse",
                    }}
                  />
                </div>
              </div>

              {/* Main Title */}
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-white/40">
                  Your Aura
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-blue-300 bg-clip-text text-transparent">
                    {auraType}
                  </span>
                  <span className="ml-2">{auraEmojis[auraType] || "🌙"}</span>
                </h1>
              </div>

              {/* Description */}
              <p className="mb-8 max-w-xs text-sm leading-relaxed text-white/50 sm:text-base">
                {auraDescriptions[auraType] || auraDescriptions.Chill}
              </p>

              {/* Stats */}
              <div className="mb-8 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm">
                <Music className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white/70">
                  <span className="font-semibold text-white">{songsRated}</span>{" "}
                  songs rated
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full flex-col gap-3">
                {/* Primary Button - View Leaderboard */}
                <Link
                  href="/leaderboard"
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-full px-8 py-4 transition-all duration-300"
                >
                  {/* Button gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 transition-all duration-300 group-hover:from-purple-500 group-hover:via-violet-500 group-hover:to-blue-500" />

                  {/* Glow effect */}
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-60" />

                  {/* Button content */}
                  <span className="relative flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                    View Leaderboard
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>

                {/* Secondary Button - Dashboard */}
                <Link
                  href="/dashboard"
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 px-8 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                >
                  <span className="relative flex items-center gap-2 text-sm font-medium text-white/70 transition-colors duration-300 group-hover:text-white">
                    Go to Dashboard
                  </span>
                </Link>

                {/* Tertiary Button - Share */}
                <button
                  type="button"
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 px-8 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                >
                  <span className="relative flex items-center gap-2 text-sm font-medium text-white/70 transition-colors duration-300 group-hover:text-white">
                    <Share2 className="h-4 w-4" />
                    Share Your Aura
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[20%] h-2 w-2 animate-pulse rounded-full bg-purple-400/60" />
          <div
            className="absolute right-[12%] top-[15%] h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400/60"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-[25%] left-[15%] h-1 w-1 animate-pulse rounded-full bg-violet-400/60"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-[20%] right-[8%] h-2 w-2 animate-pulse rounded-full bg-indigo-400/60"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes glow-pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
