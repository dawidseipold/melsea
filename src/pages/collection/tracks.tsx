// Layouts
import MainLayout from '../../layouts/MainLayout';

// Functions
import { getSession } from 'next-auth/react';

// Types
import type { ReactElement } from 'react';

interface ITracks {}

const Tracks = ({}: ITracks) => {
  return <div>Tracks</div>;
};

Tracks.getLayout = (page: ReactElement) => {
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

export default Tracks;
