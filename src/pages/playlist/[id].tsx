// Hooks
import { useState, useEffect } from 'react';

// Layouts
import MainLayout from '../../layouts/MainLayout';

// Types
import type { ReactElement } from 'react';
import { getPlaylist } from '../api/playlists/[id]';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

interface IPlaylist {}

export async function getServerSideProps(context) {
  const id = context.params.id;

  const {
    token: { accessToken },
  } = await getSession(context);
  const response = await getPlaylist(accessToken, id);

  const playlist = await response.json();

  return { props: { playlist } };
}

const Playlist = ({ playlist }: IPlaylist) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{playlist.name}</div>;
};

Playlist.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Playlist;
