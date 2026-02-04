-- Aura.fm Database Schema
-- Tables: profiles, songs, ratings

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  aura_type TEXT,
  total_ratings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Songs table (public read, admin write)
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  cover_url TEXT,
  genre TEXT,
  vibe TEXT, -- 'chill', 'hype', 'melancholy', 'romantic', 'energetic'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "songs_select_all" ON public.songs FOR SELECT TO authenticated USING (true);

-- Ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('like', 'okay', 'skip')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ratings_select_own" ON public.ratings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ratings_insert_own" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ratings_update_own" ON public.ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ratings_delete_own" ON public.ratings FOR DELETE USING (auth.uid() = user_id);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'username', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Seed some songs for testing
INSERT INTO public.songs (title, artist, album, genre, vibe) VALUES
  ('Midnight City', 'M83', 'Hurry Up, We''re Dreaming', 'Electronic', 'chill'),
  ('Blinding Lights', 'The Weeknd', 'After Hours', 'Synth-pop', 'hype'),
  ('Skinny Love', 'Bon Iver', 'For Emma, Forever Ago', 'Indie Folk', 'melancholy'),
  ('Electric Feel', 'MGMT', 'Oracular Spectacular', 'Psychedelic Pop', 'energetic'),
  ('Cherry', 'Lana Del Rey', 'Lust for Life', 'Dream Pop', 'romantic'),
  ('Redbone', 'Childish Gambino', 'Awaken, My Love!', 'Funk', 'chill'),
  ('Levitating', 'Dua Lipa', 'Future Nostalgia', 'Disco Pop', 'hype'),
  ('Motion Sickness', 'Phoebe Bridgers', 'Stranger in the Alps', 'Indie Rock', 'melancholy'),
  ('Heat Waves', 'Glass Animals', 'Dreamland', 'Indie Pop', 'romantic'),
  ('Feel Good Inc.', 'Gorillaz', 'Demon Days', 'Alternative', 'energetic'),
  ('Ivy', 'Frank Ocean', 'Blonde', 'R&B', 'melancholy'),
  ('Supermassive Black Hole', 'Muse', 'Black Holes and Revelations', 'Alternative Rock', 'hype'),
  ('Pink + White', 'Frank Ocean', 'Blonde', 'R&B', 'chill'),
  ('Bags', 'Clairo', 'Immunity', 'Bedroom Pop', 'romantic'),
  ('Take On Me', 'a-ha', 'Hunting High and Low', 'Synth-pop', 'energetic')
ON CONFLICT DO NOTHING;
