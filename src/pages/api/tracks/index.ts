import { getAccessToken } from '../../../lib/spotify';
import { getSession } from 'next-auth/react';

const SPOTIFY_SAVED_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/tracks';

export const getUsersSavedTracks = async (refresh_token: string) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(SPOTIFY_SAVED_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getSession({ req });
  const response = await getUsersSavedTracks(accessToken);
  const data = await response.json();

  return res.status(200).json(data);
};

export default handler;
