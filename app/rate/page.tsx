"use client";

import { useState, useEffect, useCallback } from "react";
import { Flame, Meh, X, Sparkles, Music } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Song {
  id: string;
  title: string;
  artist: string;
  album_art_url: string | null;
  genre: string | null;
  vibe: string | null;
}

export default function RatePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<
    { song_id: string; rating: string; vibe: string | null }[]
  >([]);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const currentSong = songs[currentIndex];
  const progress =
    songs.length > 0 ? Math.round((currentIndex / songs.length) * 100) : 0;

  useEffect(() => {
    const fetchSongs = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: ratedSongs } = await supabase
        .from("ratings")
        .select("song_id")
        .eq("user_id", user.id);

      const ratedSongIds = ratedSongs?.map((r) => r.song_id) || [];

      let query = supabase.from("songs").select("*").limit(20);

      if (ratedSongIds.length > 0) {
        query = query.not("id", "in", `(${ratedSongIds.join(",")})`);
      }

      const { data: songsData } = await query;
      setSongs(songsData || []);
      setIsLoading(false);
    };

    fetchSongs();
  }, [router]);

  const handleRate = useCallback(
    async (rating: "like" | "okay" | "skip") => {
      if (!currentSong || isSubmitting) return;

      setIsSubmitting(true);

      const newRating = {
        song_id: currentSong.id,
        rating,
        vibe: currentSong.vibe,
      };
      setRatings((prev) => [...prev, newRating]);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("ratings").upsert({
          user_id: user.id,
          song_id: currentSong.id,
          rating,
        });

        const updateField =
          rating === "like"
            ? "total_likes"
            : rating === "okay"
              ? "total_okays"
              : "total_skips";
        await supabase.rpc("increment_song_stat", {
          song_id: currentSong.id,
          stat_field: updateField,
        });
      }

      if (currentIndex < songs.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        await calculateAndSaveAura([...ratings, newRating]);
        router.push("/results");
      }

      setIsSubmitting(false);
    },
    [currentSong, currentIndex, songs.length, ratings, router, isSubmitting],
  );

  const calculateAndSaveAura = async (
    allRatings: { song_id: string; rating: string; vibe: string | null }[],
  ) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const likedVibes = allRatings
      .filter((r) => r.rating === "like" && r.vibe)
      .map((r) => r.vibe);

    const vibeCounts: Record<string, number> = {};
    for (const vibe of likedVibes) {
      if (vibe) {
        vibeCounts[vibe] = (vibeCounts[vibe] || 0) + 1;
      }
    }

    const vibeToAura: Record<string, string> = {
      hype: "Hype",
      chill: "Chill",
      sad: "Sad",
      indie: "Indie",
    };

    let dominantVibe = "chill";
    let maxCount = 0;
    for (const [vibe, count] of Object.entries(vibeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantVibe = vibe;
      }
    }

    const auraType = vibeToAura[dominantVibe] || "Chill";

    await supabase
      .from("profiles")
      .update({
        aura_type: auraType,
        total_ratings: allRatings.length,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  };

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-background" />
        <div className="absolute -left-20 top-20 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute -right-20 bottom-20 h-[300px] w-[300px] rounded-full bg-secondary/20 blur-[130px]" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading songs...</p>
        </div>
      </main>
    );
  }

  if (songs.length === 0) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-background" />
        <div className="absolute -left-20 top-20 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute -right-20 bottom-20 h-[300px] w-[300px] rounded-full bg-secondary/20 blur-[130px]" />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <Music className="h-12 w-12 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            No more songs to rate!
          </h2>
          <p className="text-muted-foreground">
            You&apos;ve rated all available songs.
          </p>
          <Link
            href="/results"
            className="mt-4 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-medium text-primary-foreground transition-all hover:scale-105"
          >
            View Your Results
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Vibrant background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-background" />
        <div className="absolute -left-20 top-10 h-[450px] w-[450px] rounded-full bg-brand-orange/25 blur-[150px]" />
        <div className="absolute -right-20 top-1/3 h-[350px] w-[350px] rounded-full bg-brand-blue/25 blur-[130px]" />
        <div className="absolute bottom-10 left-1/4 h-[300px] w-[300px] rounded-full bg-brand-yellow/15 blur-[120px]" />
      </div>

      {/* Progress bar at top */}
      <div className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
        <div className="mx-auto max-w-md">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10 backdrop-blur-sm">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-brand-amber to-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {currentIndex + 1} of {songs.length} songs
            </span>
            <span>{progress}% complete</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Logo */}
        <Link
          href="/"
          className="absolute left-4 top-16 transition-opacity hover:opacity-80 sm:left-8"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-brand-amber to-accent shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              aura.fm
            </span>
          </div>
        </Link>

        {/* Main Glass Card */}
        <div className="relative w-full max-w-sm">
          {/* Card glow */}
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary/15 via-accent/15 to-secondary/15 blur-2xl" />

          {/* Main glass card */}
          <div className="relative rounded-[2rem] border border-border bg-card p-8 backdrop-blur-2xl">
            {/* Inner glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-foreground/5 to-transparent" />

            {/* Content */}
            <div className="relative flex flex-col items-center">
              {/* Album Art Placeholder */}
              <div className="relative mb-6">
                {/* Glow behind album */}
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 blur-2xl" />

                {/* Album container */}
                <div className="relative h-52 w-52 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-foreground/10 to-foreground/5 backdrop-blur-sm sm:h-60 sm:w-60">
                  {currentSong?.album_art_url ? (
                    <img
                      src={currentSong.album_art_url || "/placeholder.svg"}
                      alt={currentSong.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
                      <div className="mb-3 rounded-full border border-border bg-foreground/5 p-4">
                        <Music className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-2 w-20 rounded-full bg-foreground/10" />
                        <div className="h-2 w-14 rounded-full bg-foreground/10" />
                      </div>
                    </div>
                  )}

                  {/* Subtle reflection */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-foreground/5 to-transparent" />
                </div>

                {/* Animated ring */}
                <div
                  className="absolute -inset-1 rounded-2xl border border-primary/20"
                  style={{
                    animation: "pulse-border 3s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Song Info */}
              <div className="mb-8 flex flex-col items-center text-center">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {currentSong?.title}
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                  {currentSong?.artist}
                </p>
                {currentSong?.genre && (
                  <span className="mt-3 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {currentSong.genre}
                  </span>
                )}
              </div>

              {/* Rating Buttons */}
              <div className="flex items-center gap-4">
                {/* Skip Button */}
                <button
                  type="button"
                  onClick={() => handleRate("skip")}
                  disabled={isSubmitting}
                  onMouseEnter={() => setHoveredButton("skip")}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full transition-all duration-300 disabled:opacity-50 sm:h-16 sm:w-16"
                >
                  <div
                    className={`absolute inset-0 rounded-full border transition-all duration-300 ${
                      hoveredButton === "skip"
                        ? "border-destructive/50 bg-destructive/20"
                        : "border-border bg-foreground/5"
                    }`}
                  />
                  <div
                    className={`absolute -inset-1 rounded-full bg-destructive/40 blur-lg transition-opacity duration-300 ${
                      hoveredButton === "skip" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <X
                    className={`relative h-6 w-6 transition-all duration-300 sm:h-7 sm:w-7 ${
                      hoveredButton === "skip"
                        ? "scale-110 text-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>

                {/* Okay Button */}
                <button
                  type="button"
                  onClick={() => handleRate("okay")}
                  disabled={isSubmitting}
                  onMouseEnter={() => setHoveredButton("okay")}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full transition-all duration-300 disabled:opacity-50 sm:h-16 sm:w-16"
                >
                  <div
                    className={`absolute inset-0 rounded-full border transition-all duration-300 ${
                      hoveredButton === "okay"
                        ? "border-secondary/50 bg-secondary/20"
                        : "border-border bg-foreground/5"
                    }`}
                  />
                  <div
                    className={`absolute -inset-1 rounded-full bg-secondary/40 blur-lg transition-opacity duration-300 ${
                      hoveredButton === "okay" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Meh
                    className={`relative h-6 w-6 transition-all duration-300 sm:h-7 sm:w-7 ${
                      hoveredButton === "okay"
                        ? "scale-110 text-secondary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>

                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => handleRate("like")}
                  disabled={isSubmitting}
                  onMouseEnter={() => setHoveredButton("like")}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full transition-all duration-300 disabled:opacity-50 sm:h-20 sm:w-20"
                >
                  <div
                    className={`absolute inset-0 rounded-full border transition-all duration-300 ${
                      hoveredButton === "like"
                        ? "border-primary/50 bg-gradient-to-br from-primary/30 to-accent/30"
                        : "border-border bg-foreground/5"
                    }`}
                  />
                  <div
                    className={`absolute -inset-2 rounded-full bg-gradient-to-r from-primary/50 to-accent/50 blur-xl transition-opacity duration-300 ${
                      hoveredButton === "like" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Flame
                    className={`relative h-7 w-7 transition-all duration-300 sm:h-8 sm:w-8 ${
                      hoveredButton === "like"
                        ? "scale-110 text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              </div>

              {/* Button Labels */}
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="w-14 text-center sm:w-16">Skip</span>
                <span className="w-14 text-center sm:w-16">Okay</span>
                <span className="w-16 text-center sm:w-20">Like</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-[25%] h-2 w-2 rounded-full bg-primary/60" />
          <div className="absolute right-[15%] top-[20%] h-1.5 w-1.5 rounded-full bg-secondary/60" />
          <div className="absolute bottom-[20%] left-[20%] h-1 w-1 rounded-full bg-accent/60" />
          <div className="absolute bottom-[30%] right-[10%] h-2 w-2 rounded-full bg-brand-cyan/60" />
        </div>
      </div>

      {/* Custom animation keyframes */}
      <style jsx>{`
        @keyframes pulse-border {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.02);
          }
        }
      `}</style>
    </main>
  );
}
