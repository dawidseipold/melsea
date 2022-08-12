import getAccessToken from '../../../lib/spotify';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

const SPOTIFY_PLAYLISTS_ENDPOINT = '	https://api.spotify.com/v1/playlists';

export const getPlaylist = async (refresh_token: string, id: string) => {
  const { access_token } = await getAccessToken(refresh_token);

  return fetch(`${SPOTIFY_PLAYLISTS_ENDPOINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const {
    token: { accessToken },
  } = await getSession({ req });
  const response = await getPlaylist(accessToken, id);

  const data = await response.json();

  return res.status(200).json(data);
};

export default handler;
