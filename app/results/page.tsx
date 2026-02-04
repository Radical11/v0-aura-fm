"use client";

import React from "react"

import { useEffect, useState } from "react";
import { Sparkles, Moon, Music, ChevronRight, Share2, Zap, Heart, Guitar } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface VibeCount {
  vibe: string;
  count: number;
}

interface AuraResult {
  auraType: string;
  vibeBreakdown: VibeCount[];
  totalLiked: number;
  totalRated: number;
  username: string | null;
}

const AURA_CONFIG: Record<string, { 
  icon: React.ReactNode; 
  emoji: string; 
  description: string; 
  gradient: string;
  barColor: string;
}> = {
  chill: {
    icon: <Moon className="h-12 w-12 text-cyan-300 sm:h-14 sm:w-14" />,
    emoji: "🌙",
    description: "You vibe with laid-back beats, dreamy melodies, and late-night soundscapes. Your music taste is effortlessly cool and introspective.",
    gradient: "from-cyan-400 to-blue-500",
    barColor: "from-cyan-400 to-blue-400",
  },
  hype: {
    icon: <Zap className="h-12 w-12 text-orange-300 sm:h-14 sm:w-14" />,
    emoji: "🔥",
    description: "You're all about high-energy tracks that get you moving! Upbeat rhythms and powerful drops are your jam.",
    gradient: "from-orange-400 to-red-500",
    barColor: "from-orange-400 to-red-400",
  },
  sad: {
    icon: <Heart className="h-12 w-12 text-purple-300 sm:h-14 sm:w-14" />,
    emoji: "💜",
    description: "You connect deeply with music that tells a story. Heartfelt lyrics and soulful melodies speak to your heart.",
    gradient: "from-purple-400 to-pink-500",
    barColor: "from-purple-400 to-pink-400",
  },
  indie: {
    icon: <Guitar className="h-12 w-12 text-emerald-300 sm:h-14 sm:w-14" />,
    emoji: "🎸",
    description: "You have eclectic taste and appreciate unique sounds. Indie gems and alternative vibes define your musical identity.",
    gradient: "from-emerald-400 to-teal-500",
    barColor: "from-emerald-400 to-teal-400",
  },
  balanced: {
    icon: <Sparkles className="h-12 w-12 text-violet-300 sm:h-14 sm:w-14" />,
    emoji: "✨",
    description: "Your taste is wonderfully diverse! You appreciate all kinds of music and don't limit yourself to one vibe.",
    gradient: "from-violet-400 to-purple-500",
    barColor: "from-violet-400 to-purple-400",
  },
};

export default function ResultsPage() {
  const [result, setResult] = useState<AuraResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const calculateAura = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      // Get all ratings with song vibes
      const { data: ratings } = await supabase
        .from("ratings")
        .select("rating, songs(vibe)")
        .eq("user_id", user.id);

      if (!ratings || ratings.length === 0) {
        router.push("/rate");
        return;
      }

      // Count vibes for liked songs only
      const vibeCounts: Record<string, number> = {
        chill: 0,
        hype: 0,
        sad: 0,
        indie: 0,
      };

      let totalLiked = 0;

      for (const rating of ratings) {
        if (rating.rating === "like" && rating.songs) {
          const vibe = (rating.songs as { vibe: string }).vibe;
          if (vibe && vibeCounts[vibe] !== undefined) {
            vibeCounts[vibe]++;
            totalLiked++;
          }
        }
      }

      // Convert to array and sort by count
      const vibeBreakdown: VibeCount[] = Object.entries(vibeCounts)
        .map(([vibe, count]) => ({ vibe, count }))
        .sort((a, b) => b.count - a.count);

      // Determine dominant aura
      let dominantAura = "balanced";
      if (totalLiked > 0) {
        const topVibe = vibeBreakdown[0];
        const secondVibe = vibeBreakdown[1];

        // Only set dominant if it's clearly ahead or tied at top
        if (topVibe.count > 0 && topVibe.count >= secondVibe.count) {
          dominantAura = topVibe.vibe;
        }
      }

      setResult({
        auraType: dominantAura,
        vibeBreakdown,
        totalLiked,
        totalRated: ratings.length,
        username: profile?.username || null,
      });

      // Update profile with aura type
      await supabase
        .from("profiles")
        .update({ aura_type: dominantAura, total_ratings: ratings.length })
        .eq("id", user.id);

      setIsLoading(false);
    };

    calculateAura();
  }, [router]);

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0d1033]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <p className="text-white/60">Calculating your aura...</p>
        </div>
      </main>
    );
  }

  if (!result) return null;

  const auraConfig = AURA_CONFIG[result.auraType] || AURA_CONFIG.balanced;

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
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Logo */}
        <div className="absolute left-4 top-6 sm:left-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight text-white/90">aura.fm</span>
          </Link>
        </div>

        {/* Main Glass Card */}
        <div className="relative w-full max-w-md">
          {/* Animated glow ring */}
          <div
            className={`absolute -inset-4 rounded-[2rem] bg-gradient-to-r ${auraConfig.gradient} opacity-30 blur-3xl`}
            style={{ animation: "glow-pulse 4s ease-in-out infinite" }}
          />

          {/* Main glass card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
            <div className="relative flex flex-col items-center text-center">
              {/* Aura Icon */}
              <div className="relative mb-6">
                <div className={`absolute -inset-6 rounded-full bg-gradient-to-br ${auraConfig.gradient} opacity-40 blur-2xl`} />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm sm:h-28 sm:w-28">
                  {auraConfig.icon}
                  <div className="absolute -inset-1 animate-[spin_20s_linear_infinite] rounded-full border-2 border-purple-500/30" />
                </div>
              </div>

              {/* User greeting */}
              {result.username && (
                <p className="mb-1 text-sm text-white/40">{result.username}&apos;s Music Aura</p>
              )}

              {/* Main Title */}
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-white/40">Your Aura</p>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  <span className={`bg-gradient-to-r ${auraConfig.gradient} bg-clip-text text-transparent`}>
                    {result.auraType.charAt(0).toUpperCase() + result.auraType.slice(1)}
                  </span>
                  <span className="ml-2">{auraConfig.emoji}</span>
                </h1>
              </div>

              {/* Description */}
              <p className="mb-8 max-w-xs text-sm leading-relaxed text-white/50 sm:text-base">
                {auraConfig.description}
              </p>

              {/* Vibe Breakdown */}
              <div className="mb-8 w-full">
                <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">
                  Vibe Breakdown
                </h2>
                <div className="space-y-3">
                  {result.vibeBreakdown.map((item) => {
                    const percentage = result.totalLiked > 0 ? (item.count / result.totalLiked) * 100 : 0;
                    const vibeConfig = AURA_CONFIG[item.vibe] || AURA_CONFIG.balanced;

                    return (
                      <div key={item.vibe}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-2 text-sm font-medium text-white/80">
                            <span>{vibeConfig.emoji}</span>
                            {item.vibe.charAt(0).toUpperCase() + item.vibe.slice(1)}
                          </span>
                          <span className="text-sm text-white/50">
                            {item.count} {item.count === 1 ? "song" : "songs"}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${vibeConfig.barColor} transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="mb-8 flex w-full gap-4">
                <div className="flex flex-1 flex-col items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <span className="text-2xl font-bold text-white">{result.totalRated}</span>
                  <span className="text-xs text-white/50">Songs Rated</span>
                </div>
                <div className="flex flex-1 flex-col items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <span className="text-2xl font-bold text-white">{result.totalLiked}</span>
                  <span className="text-xs text-white/50">Songs Liked</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full flex-col gap-3">
                <Link
                  href="/leaderboard"
                  className={`group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r ${auraConfig.gradient} px-8 py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                >
                  <span className="relative flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                    View Leaderboard
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>

                <Link
                  href="/dashboard"
                  className="group flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                >
                  <span className="text-sm font-medium text-white/70 transition-colors group-hover:text-white">
                    Go to Dashboard
                  </span>
                </Link>

                <button
                  type="button"
                  className="group flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4 text-white/70 transition-colors group-hover:text-white" />
                  <span className="text-sm font-medium text-white/70 transition-colors group-hover:text-white">
                    Share Your Aura
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 animate-pulse rounded-full bg-purple-400/60"
              style={{
                top: `${15 + i * 20}%`,
                left: `${8 + i * 25}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
      `}</style>
    </main>
  );
}
