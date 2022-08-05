// Layouts
import MainLayout from '../layouts/MainLayout';

// Types
import type { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';

interface IDiscover {}

const Discover: NextPageWithLayout = ({}: IDiscover) => {
  return <div>Discover</div>;
};

Discover.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Discover;
