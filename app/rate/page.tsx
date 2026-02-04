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

      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Get songs the user hasn't rated yet
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

      // Store rating locally
      const newRating = {
        song_id: currentSong.id,
        rating,
        vibe: currentSong.vibe,
      };
      setRatings((prev) => [...prev, newRating]);

      // Save to database
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

        // Update song stats
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

      // Move to next song or finish
      if (currentIndex < songs.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Calculate aura and save
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

    // Count vibes from liked songs
    const likedVibes = allRatings
      .filter((r) => r.rating === "like" && r.vibe)
      .map((r) => r.vibe);

    const vibeCounts: Record<string, number> = {};
    for (const vibe of likedVibes) {
      if (vibe) {
        vibeCounts[vibe] = (vibeCounts[vibe] || 0) + 1;
      }
    }

    // Map vibes to aura types
    const vibeToAura: Record<string, string> = {
      energetic: "Energetic",
      chill: "Chill",
      emotional: "Emotional",
      bold: "Bold",
      dreamy: "Dreamy",
    };

    // Find dominant vibe
    let dominantVibe = "chill";
    let maxCount = 0;
    for (const [vibe, count] of Object.entries(vibeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantVibe = vibe;
      }
    }

    const auraType = vibeToAura[dominantVibe] || "Chill";

    // Update profile
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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0d1033]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <p className="text-white/60">Loading songs...</p>
        </div>
      </main>
    );
  }

  if (songs.length === 0) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0d1033]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Music className="h-12 w-12 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">
            No more songs to rate!
          </h2>
          <p className="text-white/60">
            You&apos;ve rated all available songs.
          </p>
          <Link
            href="/results"
            className="mt-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-medium text-white transition-all hover:scale-105"
          >
            View Your Results
          </Link>
        </div>
      </main>
    );
  }

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

      {/* Progress bar at top */}
      <div className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
        <div className="mx-auto max-w-md">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-white/40">
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
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Sparkles className="h-4 w-4 text-white" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 opacity-60 blur-md" />
            </div>
            <span className="text-base font-semibold tracking-tight text-white/90">
              aura.fm
            </span>
          </div>
        </Link>

        {/* Main Glass Card */}
        <div className="relative w-full max-w-sm">
          {/* Card glow */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-violet-500/20 opacity-75 blur-2xl" />

          {/* Main glass card */}
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            {/* Inner border highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5" />

            {/* Content */}
            <div className="flex flex-col items-center">
              {/* Album Art Placeholder */}
              <div className="relative mb-6">
                {/* Glow behind album */}
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl" />

                {/* Album container */}
                <div className="relative h-48 w-48 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm sm:h-56 sm:w-56">
                  {currentSong?.album_art_url ? (
                    <img
                      src={currentSong.album_art_url || "/placeholder.svg"}
                      alt={currentSong.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="mb-3 rounded-full border border-white/10 bg-white/5 p-4">
                        <Music className="h-8 w-8 text-white/40" />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-2 w-20 rounded-full bg-white/10" />
                        <div className="h-2 w-14 rounded-full bg-white/10" />
                      </div>
                    </div>
                  )}

                  {/* Subtle reflection */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent" />
                </div>

                {/* Animated ring around album */}
                <div
                  className="absolute -inset-1 rounded-2xl border border-purple-500/20"
                  style={{
                    animation: "pulse-border 3s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Song Info */}
              <div className="mb-8 flex flex-col items-center text-center">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {currentSong?.title}
                </h2>
                <p className="text-sm text-white/50 sm:text-base">
                  {currentSong?.artist}
                </p>
                {currentSong?.genre && (
                  <span className="mt-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
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
                    className={`absolute inset-0 rounded-full border border-white/10 bg-white/5 transition-all duration-300 ${
                      hoveredButton === "skip"
                        ? "border-red-500/30 bg-red-500/10"
                        : ""
                    }`}
                  />
                  <div
                    className={`absolute -inset-1 rounded-full bg-red-500/30 blur-lg transition-opacity duration-300 ${
                      hoveredButton === "skip" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <X
                    className={`relative h-6 w-6 transition-all duration-300 sm:h-7 sm:w-7 ${
                      hoveredButton === "skip"
                        ? "scale-110 text-red-400"
                        : "text-white/60"
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
                    className={`absolute inset-0 rounded-full border border-white/10 bg-white/5 transition-all duration-300 ${
                      hoveredButton === "okay"
                        ? "border-yellow-500/30 bg-yellow-500/10"
                        : ""
                    }`}
                  />
                  <div
                    className={`absolute -inset-1 rounded-full bg-yellow-500/30 blur-lg transition-opacity duration-300 ${
                      hoveredButton === "okay" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Meh
                    className={`relative h-6 w-6 transition-all duration-300 sm:h-7 sm:w-7 ${
                      hoveredButton === "okay"
                        ? "scale-110 text-yellow-400"
                        : "text-white/60"
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
                        ? "border-orange-500/50 bg-gradient-to-br from-orange-500/20 to-red-500/20"
                        : "border-white/10 bg-white/5"
                    }`}
                  />
                  <div
                    className={`absolute -inset-2 rounded-full bg-gradient-to-r from-orange-500/40 to-red-500/40 blur-xl transition-opacity duration-300 ${
                      hoveredButton === "like" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Flame
                    className={`relative h-7 w-7 transition-all duration-300 sm:h-8 sm:w-8 ${
                      hoveredButton === "like"
                        ? "scale-110 text-orange-400"
                        : "text-white/60"
                    }`}
                  />
                </button>
              </div>

              {/* Button Labels */}
              <div className="mt-4 flex items-center gap-4 text-xs text-white/30">
                <span className="w-14 text-center sm:w-16">Skip</span>
                <span className="w-14 text-center sm:w-16">Okay</span>
                <span className="w-16 text-center sm:w-20">Like</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-[25%] h-2 w-2 animate-pulse rounded-full bg-purple-400/60" />
          <div
            className="absolute right-[15%] top-[20%] h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400/60"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-[20%] left-[20%] h-1 w-1 animate-pulse rounded-full bg-violet-400/60"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-[30%] right-[10%] h-2 w-2 animate-pulse rounded-full bg-indigo-400/60"
            style={{ animationDelay: "0.5s" }}
          />
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
