const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_SCOPES = [
  // Images
  'ugc-image-upload',

  // Spotify Connect
  'user-modify-playback-state',
  'user-read-playback-state',
  'user-read-currently-playing',

  // Follow
  'user-follow-modify',
  'user-follow-read',

  // Listening History
  'user-read-recently-played',
  'user-read-playback-position',
  'user-top-read',

  // Playlists
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',

  // Playback
  'app-remote-control',
  'streaming',

  // Users
  'user-read-email',
  'user-read-private',

  // Library
  'user-library-modify',
  'user-library-read',
];

// Exports

export const SPOTIFY_LOGIN_URL = `${SPOTIFY_AUTH_URL}?scope=${SPOTIFY_SCOPES.join(',')}`;

export const SPOTIFY_REFRESH_TOKEN = `https://accounts.spotify.com/authorize?response_type=code&client_id=${
  process.env.SPOTIFY_CLIENT_ID
}&scope=${SPOTIFY_SCOPES.join(
  ','
)}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fspotify`;

const basic = Buffer.from(
  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64');

export const getAccessToken = async (refresh_token: string) => {
  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
};

export const isLoved = async (refresh_token: string, type: string, ids: string) => {
  const { access_token } = await getAccessToken(refresh_token);

  return await fetch(
    `https://api.spotify.com/v1/me/${type}/contains?${new URLSearchParams({
      ids: ids,
    })}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
};

export const useLoved = async (access_token: string, type: string, id: string, loved: boolean) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/${type}?${new URLSearchParams({
      ids: id,
    })}`,
    {
      method: loved ? 'DELETE' : 'PUT',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const data = await response;
  return data;
};

export const checkArtistFollow = async (refresh_token: string, id: string) => {
  const { access_token } = await getAccessToken(refresh_token);

  return await fetch(
    `https://api.spotify.com/v1/me/following/contains?${new URLSearchParams({
      type: 'artist',
      ids: id,
    })}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
};

export { getUserShows } from './shows';
export { getUserProfile } from './users';
export { getTrack } from './tracks';
export { getUserAlbums, getAlbum, getAlbumTracks } from './albums';
export { getPlaylistTracks, createPlaylist, removePlaylist } from './playlists';
export { getPlaybackState, getCurrentlyPlayingTrack, getRecentlyPlayedTracks } from './player';
export {
  getUserArtists,
  getArtist,
  getArtistTracks,
  getArtistDiscography,
  getArtistFeatures,
  useArtistFollow,
} from './artists';
