// Import tracks from a Spotify playlist into the `songs` table in Supabase.
//
// This is designed for hackathon/demo use: you configure env vars and run it
// manually from your machine or a secure CI step.
//
// Usage (from project root):
// Single playlist example:
//   SPOTIFY_CLIENT_ID=... \
//   SPOTIFY_CLIENT_SECRET=... \
//   SPOTIFY_PLAYLISTS="PLAYLIST_ID:chill" \
//   SUPABASE_URL=... \
//   SUPABASE_SERVICE_ROLE_KEY=... \
//   npm run import:spotify
//
// Multiple playlists example (comma separated):
//   SPOTIFY_PLAYLISTS="ID_CHILL:chill,ID_HYPE:hype,ID_SAD:sad" ...
//
// IMPORTANT:
// - Use the Supabase **service role key** here, never the public anon key.
// - Do NOT expose any of these secrets to the browser or commit them.

const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_PLAYLISTS, // format: ID:vibe,ID:vibe
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_PLAYLISTS) {
  console.error('Missing one of SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_PLAYLISTS');
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

async function fetchPlaylistTracks(accessToken, playlistId) {
  const items = [];
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

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

function mapTracksToSongs(items, vibe) {
  return items
    .map((item) => item.track)
    .filter(Boolean)
    .map((track) => {
      const title = track.name;
      const artist = track.artists && track.artists[0] ? track.artists[0].name : 'Unknown artist';
      const album = track.album ? track.album.name : null;
      const images = track.album && track.album.images ? track.album.images : [];
      const coverUrl = images[0] ? images[0].url : null;
      const previewUrl = track.preview_url || null;
      const externalId = track.id;

      return {
        title,
        artist,
        album,
        // schema alignment
        cover_url: coverUrl,
        album_art_url: coverUrl,
        genre: null,
        vibe,
        provider: 'spotify',
        external_id: externalId,
        preview_url: previewUrl,
      };
    });
}

async function insertSongs(songs) {
  if (!songs.length) {
    console.log('No songs to insert.');
    return;
  }

  console.log(`Upserting ${songs.length} songs into public.songs...`);

  const { error } = await supabase
    .from('songs')
    .upsert(songs, { onConflict: 'provider,external_id' });

  if (error) {
    throw new Error(`Supabase insert error: ${error.message || error}`);
  }

  console.log('Insert completed.');
}

async function main() {
  console.log('Fetching Spotify access token...');
  const token = await getSpotifyAccessToken();

  const playlistSpecs = SPOTIFY_PLAYLISTS.split(',')
    .map((spec) => spec.trim())
    .filter(Boolean)
    .map((spec) => {
      const [id, vibe = 'chill'] = spec.split(':');
      return { id, vibe };
    })
    .filter((p) => p.id);

  if (!playlistSpecs.length) {
    console.error('No valid entries in SPOTIFY_PLAYLISTS. Expected format ID:vibe,ID:vibe');
    process.exit(1);
  }

  for (const { id, vibe } of playlistSpecs) {
    console.log(`\nFetching tracks from playlist ${id} with vibe="${vibe}"...`);
    const items = await fetchPlaylistTracks(token, id);
    console.log(`Fetched ${items.length} tracks from playlist ${id}.`);
    const songs = mapTracksToSongs(items, vibe);
    console.log(`Mapped to ${songs.length} song rows.`);
    await insertSongs(songs);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});