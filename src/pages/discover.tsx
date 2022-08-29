// Layouts
import MainLayout from '../layouts/MainLayout';

// Types
import { ReactElement, useEffect, useState } from 'react';
import { NextPageWithLayout } from './_app';
import { getSession, useSession } from 'next-auth/react';
import { getAccessToken } from '../lib/spotify';
import { getPlaybackState, getRecentlyPlayedTracks } from '../lib/spotify';

interface IDiscover {}

const array = [{ test: '7jCy1opEtV4a0TnKrtsSdo' }, { test: '04bNyVaHOay6vrByd0eqad' }];

const Discover: NextPageWithLayout = ({ playbackState }: IDiscover) => {
  console.log(playbackState);

  return <div>sd</div>;
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

  const {
    token: { accessToken },
  } = session;

  const { access_token: token } = await getAccessToken(accessToken);

  const responseRecent = await getRecentlyPlayedTracks(token);
  const playbackState = await responseRecent.json();

  return {
    props: { playbackState, token },
  };
}

export default Discover;
