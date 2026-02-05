"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Search, Music2 } from "lucide-react";
import Link from "next/link";

interface Song {
  id: string;
  title: string;
  artist: string;
  album_art_url: string | null;
  genre: string | null;
  vibe: string | null;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSongs([]);
      return;
    }

    const supabase = createClient();
    const controller = new AbortController();

    async function runSearch() {
      setIsLoading(true);

      const { data } = await supabase
        .from("songs")
        .select("id, title, artist, album_art_url, genre, vibe")
        .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
        .limit(30);

      if (!controller.signal.aborted) {
        setSongs((data as Song[]) || []);
        setIsLoading(false);
      }
    }

    const timeout = setTimeout(runSearch, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute -left-24 top-8 h-[420px] w-[420px] rounded-full bg-brand-amber/30 blur-[150px]" />
        <div className="absolute -right-24 bottom-10 h-[340px] w-[340px] rounded-full bg-brand-cyan/30 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-white/60 shadow-lg shadow-primary/20 backdrop-blur-xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/70 via-brand-amber/70 to-accent/70 opacity-70" />
              <Sparkles className="relative h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              aura.fm
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/40 bg-white/40 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-xl transition-all hover:bg-white/60 hover:text-foreground"
          >
            Dashboard
          </Link>
        </header>

        {/* Search box */}
        <section className="mb-6">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
            Search the library
          </h1>
          <p className="mb-4 text-sm text-muted-foreground">
            Find songs by title or artist that power your aura.
          </p>

          <div className="relative flex items-center rounded-full border border-white/50 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-xl">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs..."
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </section>

        {/* Results */}
        <section className="flex-1 overflow-y-auto rounded-3xl border border-white/40 bg-white/40 p-4 backdrop-blur-2xl">
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Searching songs...
            </div>
          )}

          {!isLoading && query.trim() && songs.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-muted-foreground">
              <Music2 className="mb-1 h-6 w-6 text-muted-foreground" />
              <p>No songs found for "{query}"</p>
            </div>
          )}

          {!isLoading && songs.length > 0 && (
            <ul className="space-y-2">
              {songs.map((song) => (
                <li
                  key={song.id}
                  className="group flex items-center gap-3 rounded-2xl border border-white/50 bg-white/70 p-3 text-sm text-foreground shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/15"
                >
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                    {song.album_art_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={song.album_art_url}
                        alt={song.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Music2 className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{song.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {song.artist}
                    </p>
                  </div>
                  {song.vibe && (
                    <span className="rounded-full bg-foreground/5 px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {song.vibe}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {!query.trim() && !isLoading && songs.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-muted-foreground">
              <Music2 className="mb-1 h-6 w-6 text-muted-foreground" />
              <p>Start typing to search your library.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
