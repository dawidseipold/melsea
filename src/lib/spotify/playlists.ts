// Functions
import { getAccessToken } from '../spotify';

// Endpoints
const SPOTIFY_PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/playlists';

export const getPlaylistTracks = async (refresh_token: string, id: string) => {
  const { access_token } = await getAccessToken(refresh_token);

  return fetch(`${SPOTIFY_PLAYLISTS_ENDPOINT}/${id}/tracks?limit=50`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const createPlaylist = async (token: string, body: object) => {
  const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response;
  return data;
};

export const removePlaylist = async (token: string, id: string) => {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/followers`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response;
  return data;
};
