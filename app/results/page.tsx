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
    icon: <Moon className="h-12 w-12 text-secondary sm:h-14 sm:w-14" />,
    emoji: "🌊",
    description: "You vibe with laid-back beats, dreamy melodies, and late-night soundscapes. Your music taste is effortlessly cool and introspective.",
    gradient: "from-secondary to-brand-cyan",
    barColor: "from-secondary to-brand-cyan",
  },
  hype: {
    icon: <Zap className="h-12 w-12 text-primary sm:h-14 sm:w-14" />,
    emoji: "🔥",
    description: "You're all about high-energy tracks that get you moving! Upbeat rhythms and powerful drops are your jam.",
    gradient: "from-primary to-accent",
    barColor: "from-primary to-accent",
  },
  sad: {
    icon: <Heart className="h-12 w-12 text-brand-pink sm:h-14 sm:w-14" />,
    emoji: "💜",
    description: "You connect deeply with music that tells a story. Heartfelt lyrics and soulful melodies speak to your heart.",
    gradient: "from-brand-pink to-destructive",
    barColor: "from-brand-pink to-destructive",
  },
  indie: {
    icon: <Guitar className="h-12 w-12 text-brand-emerald sm:h-14 sm:w-14" />,
    emoji: "🎸",
    description: "You have eclectic taste and appreciate unique sounds. Indie gems and alternative vibes define your musical identity.",
    gradient: "from-brand-emerald to-brand-cyan",
    barColor: "from-brand-emerald to-brand-cyan",
  },
  balanced: {
    icon: <Sparkles className="h-12 w-12 text-brand-amber sm:h-14 sm:w-14" />,
    emoji: "✨",
    description: "Your taste is wonderfully diverse! You appreciate all kinds of music and don't limit yourself to one vibe.",
    gradient: "from-brand-amber to-primary",
    barColor: "from-brand-amber to-primary",
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

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      const { data: ratings } = await supabase
        .from("ratings")
        .select("rating, songs(vibe)")
        .eq("user_id", user.id);

      if (!ratings || ratings.length === 0) {
        router.push("/rate");
        return;
      }

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

      const vibeBreakdown: VibeCount[] = Object.entries(vibeCounts)
        .map(([vibe, count]) => ({ vibe, count }))
        .sort((a, b) => b.count - a.count);

      let dominantAura = "balanced";
      if (totalLiked > 0) {
        const topVibe = vibeBreakdown[0];
        const secondVibe = vibeBreakdown[1];

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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-background" />
        <div className="absolute -left-20 top-20 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute -right-20 bottom-20 h-[300px] w-[300px] rounded-full bg-secondary/20 blur-[130px]" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Calculating your aura...</p>
        </div>
      </main>
    );
  }

  if (!result) return null;

  const auraConfig = AURA_CONFIG[result.auraType] || AURA_CONFIG.balanced;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Vibrant background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-background" />
        <div className="absolute -left-20 top-10 h-[450px] w-[450px] rounded-full bg-brand-orange/25 blur-[150px]" />
        <div className="absolute -right-20 top-1/3 h-[350px] w-[350px] rounded-full bg-brand-blue/25 blur-[130px]" />
        <div className="absolute bottom-10 left-1/4 h-[300px] w-[300px] rounded-full bg-brand-yellow/15 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Logo */}
        <div className="absolute left-4 top-6 sm:left-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-brand-amber to-accent shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">aura.fm</span>
          </Link>
        </div>

        {/* Main Glass Card */}
        <div className="relative w-full max-w-md">
          {/* Animated glow ring */}
          <div
            className={`absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r ${auraConfig.gradient} opacity-30 blur-3xl`}
            style={{ animation: "glow-pulse 4s ease-in-out infinite" }}
          />

          {/* Main glass card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 backdrop-blur-2xl sm:p-10">
            {/* Inner glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-foreground/5 to-transparent" />

            <div className="relative flex flex-col items-center text-center">
              {/* Aura Icon */}
              <div className="relative mb-6">
                <div className={`absolute -inset-6 rounded-full bg-gradient-to-br ${auraConfig.gradient} opacity-40 blur-2xl`} />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-border bg-gradient-to-br from-foreground/10 to-foreground/5 backdrop-blur-sm sm:h-28 sm:w-28">
                  {auraConfig.icon}
                  <div className={`absolute -inset-1 animate-[spin_20s_linear_infinite] rounded-full border-2 border-dashed opacity-30 bg-gradient-to-r ${auraConfig.gradient}`} style={{ borderColor: 'currentColor' }} />
                </div>
              </div>

              {/* User greeting */}
              {result.username && (
                <p className="mb-1 text-sm text-muted-foreground">{result.username}&apos;s Music Aura</p>
              )}

              {/* Main Title */}
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">Your Aura</p>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  <span className={`bg-gradient-to-r ${auraConfig.gradient} bg-clip-text text-transparent`}>
                    {result.auraType.charAt(0).toUpperCase() + result.auraType.slice(1)}
                  </span>
                  <span className="ml-2">{auraConfig.emoji}</span>
                </h1>
              </div>

              {/* Description */}
              <p className="mb-8 max-w-xs text-sm leading-relaxed text-muted-foreground sm:text-base">
                {auraConfig.description}
              </p>

              {/* Vibe Breakdown */}
              <div className="mb-8 w-full">
                <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Vibe Breakdown
                </h2>
                <div className="space-y-3">
                  {result.vibeBreakdown.map((item) => {
                    const percentage = result.totalLiked > 0 ? (item.count / result.totalLiked) * 100 : 0;
                    const vibeConfig = AURA_CONFIG[item.vibe] || AURA_CONFIG.balanced;

                    return (
                      <div key={item.vibe}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                            <span>{vibeConfig.emoji}</span>
                            {item.vibe.charAt(0).toUpperCase() + item.vibe.slice(1)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {item.count} {item.count === 1 ? "song" : "songs"}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
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
                <div className="flex flex-1 flex-col items-center rounded-xl border border-border bg-foreground/5 px-4 py-3 backdrop-blur-sm">
                  <span className="text-2xl font-bold text-foreground">{result.totalRated}</span>
                  <span className="text-xs text-muted-foreground">Songs Rated</span>
                </div>
                <div className="flex flex-1 flex-col items-center rounded-xl border border-border bg-foreground/5 px-4 py-3 backdrop-blur-sm">
                  <span className="text-2xl font-bold text-foreground">{result.totalLiked}</span>
                  <span className="text-xs text-muted-foreground">Songs Liked</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full flex-col gap-3">
                <Link
                  href="/leaderboard"
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-primary via-brand-amber to-accent px-8 py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25"
                >
                  <span className="relative flex items-center gap-2 text-sm font-semibold text-primary-foreground sm:text-base">
                    View Leaderboard
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>

                <Link
                  href="/dashboard"
                  className="group flex w-full items-center justify-center rounded-full border border-border bg-foreground/5 px-8 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-foreground/10"
                >
                  <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    Go to Dashboard
                  </span>
                </Link>

                <button
                  type="button"
                  className="group flex w-full items-center justify-center gap-2 rounded-full border border-border bg-foreground/5 px-8 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-foreground/10"
                >
                  <Share2 className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                  <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    Share Your Aura
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-primary/60" />
          <div className="absolute right-[20%] top-[15%] h-1.5 w-1.5 rounded-full bg-secondary/60" />
          <div className="absolute bottom-[25%] left-[10%] h-1 w-1 rounded-full bg-accent/60" />
          <div className="absolute bottom-[20%] right-[15%] h-2 w-2 rounded-full bg-brand-cyan/60" />
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
