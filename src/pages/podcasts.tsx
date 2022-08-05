// Layouts
import MainLayout from '../layouts/MainLayout';

// Types
import type { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';

interface IPodcasts {}

const Podcasts: NextPageWithLayout = ({}: IPodcasts) => {
  return <div>Podcasts</div>;
};

Podcasts.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Podcasts;
