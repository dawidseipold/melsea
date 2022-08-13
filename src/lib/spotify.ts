import { useEffect, useState } from 'react';

const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_SCOPES = [
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'streaming',
  'user-read-private',
  'user-library-read',
  'user-library-modify',
  'user-top-read',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
];

export const SPOTIFY_LOGIN_URL = `${SPOTIFY_AUTH_URL}?scope=${SPOTIFY_SCOPES.join(',')}`;

export const SPOTIFY_REFRESH_TOKEN = `https://accounts.spotify.com/authorize?response_type=code&client_id=${
  process.env.SPOTIFY_CLIENT_ID
}&scope=${SPOTIFY_SCOPES.join(
  ','
)}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fspotify`;

const basic = Buffer.from(
  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64');

const getAccessToken = async (refresh_token: string) => {
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

// Playlist Operations

const SPOTIFY_PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/playlists';

export const getPlaylistTracks = async (refresh_token: string, id: string) => {
  const { access_token } = await getAccessToken(refresh_token);

  return fetch(`${SPOTIFY_PLAYLISTS_ENDPOINT}/${id}/tracks?limit=50`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

// Loved Songs Operations

export const isLoved = async (refresh_token: string, ids: string) => {
  const { access_token } = await getAccessToken(refresh_token);

  return await fetch(`https://api.spotify.com/v1/me/tracks/contains/?ids=${ids}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const useLoved = async (id: string, access_token: string, loved: boolean) => {
  const response = await fetch(`https://api.spotify.com/v1/me/tracks/?ids=${id}`, {
    method: loved ? 'DELETE' : 'PUT',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await response;
  return data;
};

export default getAccessToken;
