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
import axios from 'axios';

interface IDiscover {}

const array = [{ test: '7jCy1opEtV4a0TnKrtsSdo' }, { test: '04bNyVaHOay6vrByd0eqad' }];

const Discover: NextPageWithLayout = ({ test, access_token }: IDiscover) => {
  console.log(access_token);

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

  const { access_token } = await getAccessToken(accessToken);

  // const getUsersPlaylists = async (refresh_token: string) => {
  //   const { access_token } = await getAccessToken(refresh_token);
  //   return fetch('https://api.spotify.com/v1/me/playlists', {
  //     headers: {
  //       Authorization: `Bearer ${access_token}`,
  //     },
  //   });
  // };

  // const response = await getPlaylists(accessToken);

  return {
    props: { accessToken, access_token },
  };
}

export default Discover;
