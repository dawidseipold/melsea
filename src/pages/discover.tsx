// Layouts
import MainLayout from '../layouts/MainLayout';

// Types
import { ReactElement, useEffect, useState } from 'react';
import { NextPageWithLayout } from './_app';
import { getSession, useSession } from 'next-auth/react';
import getAccessToken, { getToken, SPOTIFY_REFRESH_TOKEN } from '../lib/spotify';
import { get } from 'https';

import SpotifyWebApi from 'spotify-web-api-js';
import Card from '../components/common/Card/Card';

interface IDiscover {}

const array = [{ test: '7jCy1opEtV4a0TnKrtsSdo' }, { test: '04bNyVaHOay6vrByd0eqad' }];

const Discover: NextPageWithLayout = ({ test }: IDiscover) => {
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

  const test = await getAccessToken(accessToken);

  return {
    props: { test, accessToken },
  };
}

export default Discover;
