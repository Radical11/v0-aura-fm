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
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const currentSong = songs[currentIndex];
  const progress =
    songs.length > 0
      ? Math.round(((currentIndex + 1) / songs.length) * 100)
      : 0;

  const fetchSongs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      setErrorMessage("Couldn’t verify your session. Please try again.");
      setIsLoading(false);
      return;
    }
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data: ratedSongs, error: ratedSongsError } = await supabase
      .from("ratings")
      .select("song_id")
      .eq("user_id", user.id);

    if (ratedSongsError) {
      setErrorMessage("Couldn’t load your rating history. Please retry.");
      setIsLoading(false);
      return;
    }

    const ratedSongIds = ratedSongs?.map((r) => r.song_id) || [];

    let query = supabase.from("songs").select("*").limit(20);

    if (ratedSongIds.length > 0) {
      const quotedIds = ratedSongIds.map((id) => `"${id}"`).join(",");
      query = query.not("id", "in", `(${quotedIds})`);
    }

    const { data: songsData, error: songsError } = await query;
    if (songsError) {
      setErrorMessage("Couldn’t load songs. Please try again.");
      setIsLoading(false);
      return;
    }

    setSongs(songsData || []);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleRate = useCallback(
    async (rating: "like" | "okay" | "skip") => {
      if (!currentSong || isSubmitting) return;

      setIsSubmitting(true);
      setErrorMessage(null);

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

      try {
        if (user) {
          const { error: upsertError } = await supabase.from("ratings").upsert({
            user_id: user.id,
            song_id: currentSong.id,
            rating,
          });
          if (upsertError) {
            setErrorMessage("We couldn’t save that rating. Please try again.");
            return;
          }

          const updateField =
            rating === "like"
              ? "total_likes"
              : rating === "okay"
                ? "total_okays"
                : "total_skips";
          const { error: statsError } = await supabase.rpc(
            "increment_song_stat",
            {
              song_id: currentSong.id,
              stat_field: updateField,
            },
          );
          if (statsError) {
            setErrorMessage("We couldn't update song stats. Please retry.");
            return;
          }
        }

        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 1200);

        if (currentIndex < songs.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          await calculateAndSaveAura([...ratings, newRating]);
          router.push("/results");
        }
      } finally {
        setIsSubmitting(false);
      }
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
      hype: "hype",
      chill: "chill",
      sad: "sad",
      indie: "indie",
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-brand-amber/25 blur-[140px]" />
        <div className="absolute -right-24 bottom-10 h-[340px] w-[340px] rounded-full bg-brand-cyan/25 blur-[130px]" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading songs...</p>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-brand-amber/25 blur-[140px]" />
        <div className="absolute -right-24 bottom-10 h-[340px] w-[340px] rounded-full bg-brand-cyan/25 blur-[130px]" />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <Music className="h-12 w-12 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Something went wrong
          </h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={fetchSongs}
            className="mt-4 rounded-full bg-gradient-to-r from-primary via-brand-amber to-accent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (songs.length === 0) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-brand-amber/25 blur-[140px]" />
        <div className="absolute -right-24 bottom-10 h-[340px] w-[340px] rounded-full bg-brand-cyan/25 blur-[130px]" />
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
            className="mt-4 rounded-full bg-gradient-to-r from-primary via-brand-amber to-accent px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute -left-24 top-4 h-[460px] w-[460px] rounded-full bg-brand-amber/30 blur-[150px]" />
        <div className="absolute -right-20 top-1/3 h-[360px] w-[360px] rounded-full bg-brand-cyan/30 blur-[140px]" />
        <div className="absolute bottom-6 left-1/4 h-[320px] w-[320px] rounded-full bg-brand-pink/20 blur-[130px]" />
      </div>

      {/* Progress bar at top */}
      <div className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
        <div className="mx-auto max-w-md">
          <div className="h-2 w-full overflow-hidden rounded-full border border-white/40 bg-white/30 shadow-sm backdrop-blur-xl">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-brand-amber to-accent shadow-[0_0_12px_rgba(255,122,87,0.55)] transition-all duration-500"
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
            <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-white/60 shadow-lg shadow-primary/20 backdrop-blur-xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/70 via-brand-amber/70 to-accent/70 opacity-70" />
              <Sparkles className="relative h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              aura.fm
            </span>
          </div>
        </Link>

        {/* Main Glass Card */}
        <div className="relative w-full max-w-sm">
          {/* Card glow */}
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-primary/20 via-brand-amber/20 to-accent/20 blur-3xl" />

          {/* Main glass card */}
          <div className="relative rounded-[2.5rem] border border-white/40 bg-white/40 p-8 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
            {/* Inner glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/60 via-white/10 to-transparent" />

            {/* Content */}
            <div className="relative flex flex-col items-center">
              {/* Album Art Placeholder */}
              <div className="group relative mb-6">
                {/* Glow behind album */}
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary/30 via-brand-amber/25 to-accent/25 blur-3xl" />

                {/* Album container */}
                <div className="relative h-52 w-52 overflow-hidden rounded-3xl border border-white/50 bg-white/40 backdrop-blur-xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:rotate-1 sm:h-60 sm:w-60">
                  {currentSong?.album_art_url ? (
                    <img
                      src={currentSong.album_art_url || "/placeholder.svg"}
                      alt={currentSong.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/15 via-white/10 to-secondary/15">
                      <div className="mb-3 rounded-full border border-white/40 bg-white/40 p-4 backdrop-blur-xl">
                        <Music className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-2 w-20 rounded-full bg-white/40" />
                        <div className="h-2 w-14 rounded-full bg-white/40" />
                      </div>
                    </div>
                  )}

                  {/* Subtle reflection */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent" />
                </div>

                {/* Animated ring */}
                <div
                  className="absolute -inset-1 rounded-3xl border border-primary/20"
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
                  <span className="mt-3 rounded-full border border-white/50 bg-white/40 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-xl">
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
                  className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 sm:h-16 sm:w-16"
                >
                  <div
                    className={`absolute inset-0 rounded-full border transition-all duration-300 ${
                      hoveredButton === "skip"
                        ? "border-destructive/40 bg-destructive/20"
                        : "border-white/50 bg-white/40"
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
                  className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 sm:h-16 sm:w-16"
                >
                  <div
                    className={`absolute inset-0 rounded-full border transition-all duration-300 ${
                      hoveredButton === "okay"
                        ? "border-secondary/40 bg-secondary/20"
                        : "border-white/50 bg-white/40"
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
                  className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 sm:h-20 sm:w-20"
                >
                  <div
                    className={`absolute inset-0 rounded-full border transition-all duration-300 ${
                      hoveredButton === "like"
                        ? "border-primary/50 bg-gradient-to-br from-primary/30 to-accent/30"
                        : "border-white/50 bg-white/40"
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

      {showSavedToast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 py-2 text-xs font-medium text-foreground shadow-lg shadow-primary/25 backdrop-blur-xl [animation:toast-pop_0.35s_ease-out]">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Saved to your aura</span>
          </div>
        </div>
      )}

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

        @keyframes toast-pop {
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
