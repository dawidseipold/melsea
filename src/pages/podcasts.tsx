// Layouts
import MainLayout from '../layouts/MainLayout';

// Types
import type { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';
import { getSession } from 'next-auth/react';

interface IPodcasts {}

const Podcasts: NextPageWithLayout = ({}: IPodcasts) => {
  return <div>Podcasts</div>;
};

Podcasts.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Podcasts;
