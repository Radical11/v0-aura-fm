-- Extend songs table to support external providers (e.g., Spotify)
-- and align with the frontend's album_art_url usage.

ALTER TABLE public.songs
  ADD COLUMN IF NOT EXISTS provider TEXT,
  ADD COLUMN IF NOT EXISTS external_id TEXT,
  ADD COLUMN IF NOT EXISTS preview_url TEXT,
  ADD COLUMN IF NOT EXISTS album_art_url TEXT;

-- Backfill album_art_url from cover_url when missing
UPDATE public.songs
SET album_art_url = cover_url
WHERE album_art_url IS NULL AND cover_url IS NOT NULL;

-- Avoid duplicate imports when using external providers
CREATE UNIQUE INDEX IF NOT EXISTS songs_provider_external_id_key
  ON public.songs(provider, external_id)
  WHERE provider IS NOT NULL AND external_id IS NOT NULL;
