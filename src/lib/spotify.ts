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

export const useLoved = (id: string, access_token: string) => {
  const [loved, setLoved] = useState(null);

  useEffect(() => {
    const isLoved = async () => {
      const response = await fetch(`https://api.spotify.com/v1/me/tracks/contains/?ids=${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = await response.json();

      setLoved(data[0]);
    };
    isLoved();
  });

  return loved;
};

export default getAccessToken;
