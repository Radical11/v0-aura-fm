"use client";

import Link from "next/link";

const topSongs = [
  { rank: 1, title: "Blinding Lights", artist: "The Weeknd", fires: 2847 },
  { rank: 2, title: "Starboy", artist: "The Weeknd", fires: 2341 },
  { rank: 3, title: "Levitating", artist: "Dua Lipa", fires: 2156 },
  { rank: 4, title: "Save Your Tears", artist: "The Weeknd", fires: 1987 },
  { rank: 5, title: "Heat Waves", artist: "Glass Animals", fires: 1823 },
  { rank: 6, title: "Peaches", artist: "Justin Bieber", fires: 1654 },
  { rank: 7, title: "Good 4 U", artist: "Olivia Rodrigo", fires: 1542 },
  { rank: 8, title: "Stay", artist: "The Kid LAROI", fires: 1438 },
];

export default function LeaderboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-background to-blue-950" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="font-semibold text-foreground/80 text-lg tracking-tight transition-colors hover:text-foreground"
          >
            aura.fm
          </Link>
          <Link
            href="/results"
            className="rounded-full border border-border bg-card/50 px-4 py-2 text-foreground/70 text-sm backdrop-blur-md transition-all hover:border-primary/50 hover:text-foreground"
          >
            Your Aura
          </Link>
        </header>

        {/* Main content */}
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          {/* Title section */}
          <div className="mb-10 text-center">
            <h1 className="mb-3 bg-gradient-to-r from-violet-300 via-purple-200 to-blue-300 bg-clip-text font-bold text-4xl text-transparent tracking-tight md:text-5xl">
              Top Auras Today
            </h1>
            <p className="text-foreground/60 text-sm">
              The most loved songs in the community
            </p>
          </div>

          {/* Leaderboard container */}
          <div className="w-full max-w-lg">
            {/* Glass container */}
            <div className="relative rounded-3xl border border-border bg-card/40 p-2 backdrop-blur-xl md:p-3">
              {/* Inner glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent" />

              {/* Songs list */}
              <div className="relative space-y-2">
                {topSongs.map((song, index) => (
                  <div
                    key={song.rank}
                    className="group relative overflow-hidden rounded-2xl border border-transparent bg-white/5 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-white/10"
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/0 via-purple-500/0 to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:from-violet-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 group-hover:opacity-100" />

                    <div className="relative flex items-center gap-4">
                      {/* Rank badge */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                          song.rank === 1
                            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950 shadow-lg shadow-amber-500/30"
                            : song.rank === 2
                              ? "bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800 shadow-lg shadow-slate-400/30"
                              : song.rank === 3
                                ? "bg-gradient-to-br from-amber-600 to-amber-700 text-amber-100 shadow-lg shadow-amber-600/30"
                                : "border border-border bg-white/5 text-foreground/60"
                        }`}
                      >
                        {song.rank}
                      </div>

                      {/* Album art placeholder */}
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-purple-500/30 to-blue-500/30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-4 w-4 rounded-full border-2 border-white/30" />
                        </div>
                      </div>

                      {/* Song info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium text-foreground text-sm">
                          {song.title}
                        </h3>
                        <p className="truncate text-foreground/50 text-xs">
                          {song.artist}
                        </p>
                      </div>

                      {/* Fire count */}
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="text-base">🔥</span>
                        <span
                          className={`font-semibold text-sm ${
                            index < 3
                              ? "bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"
                              : "text-foreground/70"
                          }`}
                        >
                          {song.fires.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom action */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/rate"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 px-8 py-3.5 font-medium text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Rate More Songs</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-foreground/40 text-xs">
          Updated every hour
        </footer>
      </div>
    </main>
  );
}
