"use client";

import React from "react";
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

interface DashboardClientProps {
  profile: Profile | null;
  stats: RatingStats;
}

const auraIcons: Record<string, React.ReactNode> = {
  chill: <Moon className="h-6 w-6 text-secondary" />,
  hype: <Zap className="h-6 w-6 text-primary" />,
  sad: <Heart className="h-6 w-6 text-brand-pink" />,
  indie: <Guitar className="h-6 w-6 text-brand-emerald" />,
  balanced: <Sparkles className="h-6 w-6 text-brand-amber" />,
};

const auraEmojis: Record<string, string> = {
  chill: "🌊",
  hype: "🔥",
  sad: "💜",
  indie: "🎸",
  balanced: "✨",
};

const auraGradients: Record<string, string> = {
  chill: "from-secondary to-brand-cyan",
  hype: "from-primary to-accent",
  sad: "from-brand-pink to-destructive",
  indie: "from-brand-emerald to-brand-cyan",
  balanced: "from-brand-amber to-primary",
};

export default function DashboardClient({ profile, stats }: DashboardClientProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const auraType = profile?.aura_type?.toLowerCase() || null;
  const totalRatings = profile?.total_ratings || 0;
  const gradient = auraType ? auraGradients[auraType] || auraGradients.balanced : "from-primary to-accent";

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Vibrant background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-background" />
        <div className="absolute -left-20 top-10 h-[450px] w-[450px] rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute -right-20 top-1/3 h-[350px] w-[350px] rounded-full bg-secondary/20 blur-[130px]" />
        <div className="absolute bottom-10 left-1/4 h-[300px] w-[300px] rounded-full bg-accent/15 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-brand-amber to-accent shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              aura.fm
            </span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm transition-all hover:border-border hover:bg-foreground/10 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </header>

        {/* Main content */}
        <div className="mx-auto mt-8 flex w-full max-w-4xl flex-1 flex-col gap-6 sm:mt-12">
          {/* Welcome section */}
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
              Welcome back
              {profile?.username && (
                <span className={`ml-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  {profile.username}
                </span>
              )}
            </h1>
            <p className="text-muted-foreground">
              {auraType
                ? "Here's your music journey so far"
                : "Start rating songs to discover your aura"}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Aura Card */}
            <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card p-6 backdrop-blur-xl sm:col-span-2">
              <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-3xl`} />
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20`} style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))` }}>
                    {auraType ? (
                      auraIcons[auraType] || auraIcons.balanced
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Aura</p>
                    {auraType ? (
                      <p className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                        {auraType.charAt(0).toUpperCase() + auraType.slice(1)} {auraEmojis[auraType]}
                      </p>
                    ) : (
                      <p className="text-lg font-medium text-muted-foreground">
                        Not discovered yet
                      </p>
                    )}
                  </div>
                </div>
                {auraType && (
                  <Link
                    href="/results"
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    View full results
                  </Link>
                )}
              </div>
            </div>

            {/* Total Ratings */}
            <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card p-6 backdrop-blur-xl">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-secondary/20 blur-2xl" />
              <div className="relative">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                  <Music className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-sm text-muted-foreground">Songs Rated</p>
                <p className="text-3xl font-bold text-foreground">{totalRatings}</p>
              </div>
            </div>

            {/* Likes */}
            <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card p-6 backdrop-blur-xl">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <span className="text-lg">🔥</span>
                </div>
                <p className="text-sm text-muted-foreground">Songs Liked</p>
                <p className="text-3xl font-bold text-foreground">{stats.likes}</p>
              </div>
            </div>
          </div>

          {/* Rating breakdown */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Rating Breakdown
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-foreground/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <span>🔥</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.likes}</p>
                  <p className="text-sm text-muted-foreground">Liked</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-foreground/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
                  <span>😐</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.okays}</p>
                  <p className="text-sm text-muted-foreground">Okay</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-foreground/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                  <span>❌</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.skips}</p>
                  <p className="text-sm text-muted-foreground">Skipped</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/rate"
              className="group relative overflow-hidden rounded-[1.5rem] bg-gradient-to-r from-primary via-brand-amber to-accent p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
                  <Play className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-foreground">
                    Rate More Songs
                  </h3>
                  <p className="text-sm text-primary-foreground/70">
                    Discover new music and refine your aura
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/leaderboard"
              className="group relative overflow-hidden rounded-[1.5rem] border border-border bg-card p-6 backdrop-blur-xl transition-all duration-300 hover:border-border hover:bg-foreground/5"
            >
              <div className="relative flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-amber/20 to-primary/20">
                  <Trophy className="h-6 w-6 text-brand-amber" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    View Leaderboard
                  </h3>
                  <p className="text-sm text-muted-foreground">
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
