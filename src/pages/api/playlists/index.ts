import getAccessToken from '../../../lib/spotify';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

const SPOTIFY_PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';

export const getUsersPlaylists = async (refresh_token: string) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(SPOTIFY_PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getSession({ req });
  const response = await getUsersPlaylists(accessToken);
  const { items } = await response.json();

  return res.status(200).json({ items });
};

export default handler;
