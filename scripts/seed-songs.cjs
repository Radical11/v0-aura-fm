// Simple seeding script to bulk insert additional songs into the `songs` table.
//
// Usage (from project root):
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:songs
//
// IMPORTANT: Use your **service role key** here, NOT the public anon key.
// Do NOT expose the service key in client-side code.

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Keep this list small-ish but more than the 15-demo songs.
// You can freely edit/extend this array for the hackathon.
const songs = [
  { title: 'Night Drive', artist: 'Ocean Echoes', album_art_url: null, genre: 'Electronic', vibe: 'chill' },
  { title: 'Skyline Lights', artist: 'Neon Rivers', album_art_url: null, genre: 'Synthwave', vibe: 'hype' },
  { title: 'City Rain', artist: 'Lo-Fi Collective', album_art_url: null, genre: 'Lo-fi', vibe: 'chill' },
  { title: 'Velvet Sun', artist: 'Soft Season', album_art_url: null, genre: 'Indie Pop', vibe: 'indie' },
  { title: 'Glowstick Heart', artist: 'Club Mirage', album_art_url: null, genre: 'EDM', vibe: 'hype' },
  { title: 'Half-Open Window', artist: 'Bedroom Stories', album_art_url: null, genre: 'Bedroom Pop', vibe: 'indie' },
  { title: 'Afterglow Avenue', artist: 'Late Night Transit', album_art_url: null, genre: 'Alternative', vibe: 'chill' },
  { title: 'Tunnel Vision', artist: 'Monochrome', album_art_url: null, genre: 'Alt Rock', vibe: 'sad' },
  { title: 'Soft Static', artist: 'Tape Hiss', album_art_url: null, genre: 'Lo-fi', vibe: 'chill' },
  { title: 'Jetstream', artist: 'Aurora Lane', album_art_url: null, genre: 'Pop', vibe: 'hype' },
  { title: 'Glass Garden', artist: 'Ivy Bloom', album_art_url: null, genre: 'Indie', vibe: 'indie' },
  { title: 'Echo Chamber', artist: 'Faded Signals', album_art_url: null, genre: 'Indie Rock', vibe: 'sad' },
  { title: 'Moonlit Metro', artist: 'Parallel Lines', album_art_url: null, genre: 'Electronica', vibe: 'chill' },
  { title: 'Satellite Call', artist: 'Nova Relay', album_art_url: null, genre: 'Synth Pop', vibe: 'hype' },
  { title: 'Polaroid Ghosts', artist: 'Static Bloom', album_art_url: null, genre: 'Indie', vibe: 'sad' },
  { title: 'Crystal Arcade', artist: 'Pixel Pulse', album_art_url: null, genre: 'Chiptune', vibe: 'hype' },
  { title: 'Soft Focus', artist: 'Cloudroom', album_art_url: null, genre: 'Dream Pop', vibe: 'indie' },
  { title: 'Golden Hour Loop', artist: 'Sunset Loops', album_art_url: null, genre: 'Lo-fi', vibe: 'chill' },
  { title: 'Midnight Carousel', artist: 'Velour Night', album_art_url: null, genre: 'Alt Pop', vibe: 'indie' },
  { title: 'Static Hearts', artist: 'FM Arcade', album_art_url: null, genre: 'Synthwave', vibe: 'sad' },
];

async function main() {
  console.log(`Seeding ${songs.length} songs into public.songs...`);

  const { data, error } = await supabase.from('songs').insert(songs);

  if (error) {
    console.error('Error inserting songs:', error.message || error);
    process.exit(1);
  }

  console.log(`Inserted ${data ? data.length : songs.length} songs into public.songs.`);
}

main().catch((err) => {
  console.error('Unexpected error while seeding songs:', err);
  process.exit(1);
});