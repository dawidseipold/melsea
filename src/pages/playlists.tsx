// Layouts
import MainLayout from '../layouts/MainLayout';

// Types
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';

interface IPlaylists {}

const Playlists: NextPageWithLayout = ({}: IPlaylists) => {
  return <div>Playlists</div>;
};

Playlists.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Playlists;
