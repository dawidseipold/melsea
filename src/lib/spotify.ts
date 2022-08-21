import { useEffect, useState } from 'react';

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

// Playlists Operations

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

// Artists Operations

const SPOTIFY_ARTIST_ENDPOINT = 'https://api.spotify.com/v1/artists';

export const getArtist = async (token: string, id: string) => {
  return fetch(`${SPOTIFY_ARTIST_ENDPOINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArtistTracks = async (token: string, id: string, country: string) => {
  return fetch(`${SPOTIFY_ARTIST_ENDPOINT}/${id}/top-tracks?market=${country}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArtistDiscography = async (token: string, id: string) => {
  return fetch(
    `${SPOTIFY_ARTIST_ENDPOINT}/${id}/albums?${new URLSearchParams({
      include_groups: 'album,single',
      limit: '50',
    })}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getArtistFeatures = async (token: string, id: string) => {
  return fetch(
    `${SPOTIFY_ARTIST_ENDPOINT}/${id}/albums?${new URLSearchParams({
      include_groups: 'appears_on',
      limit: '8',
    })}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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

export const useArtistFollow = async (id: string, access_token: string, followed: boolean) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/following?${new URLSearchParams({
      type: 'artist',
      ids: id,
    })}`,
    {
      method: followed ? 'DELETE' : 'PUT',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const data = await response;
  return data;
};

export default getAccessToken;
