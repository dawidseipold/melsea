import getAccessToken from '../../../lib/spotify';
import { getSession } from 'next-auth/react';

const SPOTIFY_TRACKS_ENDPOINT = '	https://api.spotify.com/v1/tracks';

export const getTrack = async (refresh_token: string, id: string) => {
  const { access_token } = await getAccessToken(refresh_token);

  return fetch(`${SPOTIFY_TRACKS_ENDPOINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const handler = async (req, res) => {
  const { id } = req.query;

  const {
    token: { accessToken },
  } = await getSession({ req });
  const response = await getTrack(accessToken, id);

  const data = await response.json();

  return res.status(200).json(data);
};

export default handler;
