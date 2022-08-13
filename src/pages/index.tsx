// Components
import Head from 'next/head';
import Image from 'next/image';

// Hooks
import { useEffect, useState } from 'react';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Icons
import { Heart, Play } from 'phosphor-react';

// Types
import type { NextPageWithLayout } from './_app';
import { ReactElement } from 'react';
import Link from 'next/link';
import { getSession, useSession } from 'next-auth/react';
import getAccessToken from '../lib/spotify';
import Card from '../components/common/Card/Card';

interface IHome {}

const Home: NextPageWithLayout = ({}: IHome) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(data);

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

        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between items-center px-4 py-2 hover:bg-dark-background-secondary rounded-lg">
            <div className="flex gap-x-4 items-center">
              <span className="text-white/80">05</span>
              <Image
                src="https://i.imgur.com/Wp4hnLH.jpeg"
                width={64}
                height={64}
                className="rounded-md"
              />
              <div className="flex flex-col justify-center">
                <span>Super Song</span>
                <span className="text-sm text-white/80">Super Author</span>
              </div>
              <Heart className="text-white/80" />
            </div>

            <div className="flex items-center gap-x-20">
              <span className="text-white/80">Super Album</span>
              <span className="text-white/80">12 001 146</span>
              <span className="text-white/80">2:23</span>
              <Play className="text-white/80" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2 justify-between ">
          <h2 className="text-lg font-medium">Recent Favorites</h2>
          <span className="uppercase text-base text-brand-blue hover:underline cursor-pointer">
            view all
          </span>
        </div>

        <div className="grid items-center gap-4 grid-cols-fluid-vertical">
          {data.tracks.slice(0, 10).map((track) => {
            console.log(track);
            return <Card data={track.track} direction="vertical" type="piece" />;
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

  return {
    props: { session },
  };
}

Home.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
