// Layouts
import MainLayout from '../layouts/MainLayout';

// Types
import type { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';

interface ITrending {}

const Trending: NextPageWithLayout = ({}: ITrending) => {
  return <div>Trending</div>;
};

Trending.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Trending;
