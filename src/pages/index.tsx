// Components
import Head from 'next/head';
import Image from 'next/image';

// Hooks
import { useEffect, useState } from 'react';

// Layouts
import MainLayout, { useToken } from '../layouts/MainLayout';

// Icons
import { Heart, Play } from 'phosphor-react';

// Types
import type { NextPageWithLayout } from './_app';
import { ReactElement } from 'react';
import Link from 'next/link';
import { getSession, useSession } from 'next-auth/react';
import { getAccessToken, getRecentlyPlayedTracks, isLoved } from '../lib/spotify';
import Card from '../components/common/Card/Card';
import List from '../components/common/List/List';

interface IHome {
  recentTracks: any;
  token: string;
}

const Home: NextPageWithLayout = ({ recentTracks, token }: IHome) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const setToken = useToken((state) => state.setToken);

  let count = 1;

  useEffect(() => {
    setToken(token);

    const fetchData = async () => {
      try {
        let resPlaylists = await fetch('/api/playlists');
        let resTracks = await fetch('/api/tracks');

        if (resPlaylists.status === 200 && resTracks.status === 200) {
          let { items: playlists } = await resPlaylists.json();
          let { items: tracks } = await resTracks.json();

          setData({ playlists, tracks });

          setLoading(false);
        } else {
          throw 'Error fetching users list';
        }
      } catch (error) {
        throw `${error}`;
      }
    };

    console.log(recentTracks);

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full flex flex-col gap-y-12 p-8">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2 justify-between ">
          <h2 className="text-lg font-medium">Recently Added Playlists</h2>
          <Link href="/collection/playlists">
            <span className="uppercase text-base text-brand-blue hover:underline cursor-pointer">
              view all
            </span>
          </Link>
        </div>

        <div className="grid gap-x-4 grid-cols-4">
          {data.playlists.slice(0, 4).map((playlist) => (
            <div
              key={playlist.id}
              className="aspect-video relative rounded-xl bg-cover bg-center"
              style={{
                backgroundImage: `url(
                  ${playlist.images?.[0] ? `${playlist.images[0].url}` : `background-5.jpg`}
                )`,
              }}
            >
              <div className="p-4 flex flex-col absolute bottom-0">
                <h3 className="text-xl">{playlist.name}</h3>
                <span className="text-md text-white/60">{playlist.tracks.total} songs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <h2 className="text-lg font-medium">Recently Played</h2>

        {recentTracks.items.map(({ track }) => (
          <List
            key={track.id}
            fields={{
              cover: true,
              name: {
                artist: true,
                title: true,
              },
              album: true,
              date: false,
              info: {
                length: true,
                loved: true,
              },
            }}
            token={token}
            track={track}
            count={count++}
          />
        ))}
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2 justify-between ">
          <h2 className="text-lg font-medium">Recent Favorites</h2>
          <span className="uppercase text-base text-brand-blue hover:underline cursor-pointer">
            view all
          </span>
        </div>

        <div className="grid items-center gap-4 grid-cols-fluid-vertical">
          {data.tracks.slice(0, 10).map(({ track }) => {
            return (
              <Card
                key={track.id}
                data={track}
                direction="vertical"
                type="piece"
                prefix={track.type}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
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
  const error = responseRecent.ok
    ? false
    : { code: responseRecent.status, message: responseRecent.statusText };

  if (!error) {
    const recentTracks = await responseRecent.json();

    // Check Loved Recent Tracks

    let ids = recentTracks.items.map(({ track }) => track.id);

    const responseLoved = await isLoved(accessToken, 'tracks', ids.join(','));
    const loved = await responseLoved.json();

    recentTracks.items.forEach(({ track }, index) => {
      Object.assign(track, { loved: loved[index] });
    });

    return {
      props: { recentTracks, token },
    };
  }

  return {
    props: { error },
  };
}

Home.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
