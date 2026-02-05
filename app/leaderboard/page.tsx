"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Music, Sparkles } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string;
  total_likes: number;
}

export default function LeaderboardPage() {
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopSongs = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("songs")
        .select("id, title, artist, total_likes")
        .order("total_likes", { ascending: false })
        .limit(10);

      setTopSongs(data || []);
      setIsLoading(false);
    };

    fetchTopSongs();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted" />

      {/* Ambient glow orbs */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />

      {/* Noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-muted-foreground">
              aura.fm
            </span>
          </Link>
          <Link
            href="/results"
            className="rounded-full border border-border bg-card/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md transition-all hover:border-primary/50 hover:text-foreground"
          >
            Your Aura
          </Link>
        </header>

        {/* Main content */}
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          {/* Title section */}
          <div className="mb-10 text-center">
            <h1 className="mb-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
              Top Auras Today
            </h1>
            <p className="text-sm text-muted-foreground">
              The most loved songs in the community
            </p>
          </div>

          {/* Leaderboard container */}
          <div className="w-full max-w-lg">
            {/* Glass container */}
            <div className="relative rounded-3xl border border-border bg-card/40 p-2 backdrop-blur-xl md:p-3">
              {/* Inner glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-foreground/5 to-transparent" />

              {/* Songs list */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : topSongs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Music className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No songs rated yet</p>
                  <p className="text-sm text-muted-foreground/70">
                    Be the first to rate some songs!
                  </p>
                </div>
              ) : (
                <div className="relative space-y-2">
                  {topSongs.map((song, index) => (
                    <div
                      key={song.id}
                      className="group relative overflow-hidden rounded-2xl border border-transparent bg-foreground/5 p-4 opacity-0 [animation:leaderboard-fade-in_0.55s_ease-out_forwards] hover:border-primary/30 hover:bg-foreground/10"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-accent/0 to-secondary/0 opacity-0 transition-opacity duration-300 group-hover:from-primary/10 group-hover:via-accent/10 group-hover:to-secondary/10 group-hover:opacity-100" />

                      <div className="relative flex items-center gap-4">
                        {/* Rank badge */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            index === 0
                              ? "bg-gradient-to-br from-brand-amber to-primary text-primary-foreground shadow-lg shadow-primary/30"
                              : index === 1
                                ? "bg-gradient-to-br from-muted-foreground to-muted text-foreground shadow-lg shadow-muted/30"
                                : index === 2
                                  ? "bg-gradient-to-br from-brand-orange to-primary text-primary-foreground shadow-lg shadow-brand-orange/30"
                                  : "border border-border bg-foreground/5 text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>

                        {/* Album art placeholder */}
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/30 to-secondary/30" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-4 w-4 rounded-full border-2 border-foreground/30" />
                          </div>
                        </div>

                        {/* Song info */}
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-medium text-foreground">
                            {song.title}
                          </h3>
                          <p className="truncate text-xs text-muted-foreground">
                            {song.artist}
                          </p>
                        </div>

                        {/* Fire count */}
                        <div className="flex shrink-0 items-center gap-1.5">
                          <span className="text-base">🔥</span>
                          <span
                            className={`text-sm font-semibold ${
                              index < 3
                                ? "bg-gradient-to-r from-primary to-brand-amber bg-clip-text text-transparent"
                                : "text-muted-foreground"
                            }`}
                          >
                            {song.total_likes.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom action */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/rate"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-primary via-brand-amber to-accent px-8 py-3.5 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Rate More Songs</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground">
          Updated in real-time
        </footer>
      </div>

      <style jsx>{`
        @keyframes leaderboard-fade-in {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
