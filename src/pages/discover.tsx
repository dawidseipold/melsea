// Layouts
import MainLayout from '../layouts/MainLayout';

// Types
import type { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';
import { getSession } from 'next-auth/react';

interface IDiscover {}

const Discover: NextPageWithLayout = ({}: IDiscover) => {
  return <div>Discover</div>;
};

Discover.getLayout = (page: ReactElement) => {
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

export default Discover;
