// Import tracks from a Spotify playlist into the `songs` table in Supabase.
//
// This is designed for hackathon/demo use: you configure env vars and run it
// manually from your machine or a secure CI step.
//
// Usage (from project root):
//   SPOTIFY_CLIENT_ID=... \
//   SPOTIFY_CLIENT_SECRET=... \
//   SPOTIFY_PLAYLIST_ID=... \
//   SPOTIFY_PLAYLIST_VIBE=chill \
//   SUPABASE_URL=... \
//   SUPABASE_SERVICE_ROLE_KEY=... \
//   npm run import:spotify
//
// IMPORTANT:
// - Use the Supabase **service role key** here, never the public anon key.
// - Do NOT expose any of these secrets to the browser or commit them.

const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_PLAYLIST_ID,
  SPOTIFY_PLAYLIST_VIBE = 'chill',
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_PLAYLIST_ID) {
  console.error('Missing one of SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_PLAYLIST_ID');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function getSpotifyAccessToken() {
  const body = new URLSearchParams({ grant_type: 'client_credentials' });
  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get Spotify token: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json.access_token;
}

async function fetchPlaylistTracks(accessToken) {
  const items = [];
  let url = `https://api.spotify.com/v1/playlists/${SPOTIFY_PLAYLIST_ID}/tracks?limit=100`;

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch playlist tracks: ${res.status} ${text}`);
    }
    const json = await res.json();
    items.push(...json.items);
    url = json.next;
  }

  return items;
}

function mapTracksToSongs(items) {
  const vibe = SPOTIFY_PLAYLIST_VIBE;

  return items
    .map((item) => item.track)
    .filter(Boolean)
    .map((track) => {
      const title = track.name;
      const artist = track.artists && track.artists[0] ? track.artists[0].name : 'Unknown artist';
      const album = track.album ? track.album.name : null;
      const images = track.album && track.album.images ? track.album.images : [];
      const coverUrl = images[0] ? images[0].url : null;

      return {
        title,
        artist,
        album,
        // we set both cover_url and album_art_url to work with any existing schema
        cover_url: coverUrl,
        album_art_url: coverUrl,
        genre: null,
        vibe,
      };
    });
}

async function insertSongs(songs) {
  if (!songs.length) {
    console.log('No songs to insert.');
    return;
  }

  console.log(`Inserting ${songs.length} songs into public.songs...`);

  const { error } = await supabase.from('songs').insert(songs);

  if (error) {
    throw new Error(`Supabase insert error: ${error.message || error}`);
  }

  console.log('Insert completed.');
}

async function main() {
  console.log('Fetching Spotify access token...');
  const token = await getSpotifyAccessToken();
  console.log('Fetching playlist tracks from Spotify...');
  const items = await fetchPlaylistTracks(token);
  console.log(`Fetched ${items.length} tracks from playlist.`);
  const songs = mapTracksToSongs(items);
  console.log(`Mapped to ${songs.length} song rows with vibe="${SPOTIFY_PLAYLIST_VIBE}".`);
  await insertSongs(songs);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});