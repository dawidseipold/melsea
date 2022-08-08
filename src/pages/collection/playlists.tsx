// Layouts
import MainLayout from '../../layouts/MainLayout';

// Types
import { ReactElement, useEffect, useState } from 'react';
import type { NextPageWithLayout } from '../_app';
import Image from 'next/image';
import { DotsThreeVertical, Play } from 'phosphor-react';
import getAccessToken from '../../lib/spotify';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { getToken } from 'next-auth/jwt';

interface IPlaylists {}

const Playlists: NextPageWithLayout = ({}: IPlaylists) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let resPlaylists = await fetch('/api/playlists');

        if (resPlaylists.status === 200) {
          let { items: playlists } = await resPlaylists.json();

          setData({ playlists });

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

  return (
    <div className="flex flex-col gap-y-4 p-8">
      <h1 className="text-2xl font-bold tracking-wide">Playlists</h1>

      <div>
        <div></div>

        <ul className="flex flex-col gap-y-2">
          {data.playlists.map((playlist) => (
            <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
              <div className="flex justify-between items-center px-2 pr-4 py-2 hover:bg-dark-background-secondary rounded-lg cursor-pointer">
                <div className="flex gap-x-4 items-center">
                  <Image
                    src={playlist.images?.[0] ? playlist.images[0].url : '/background-1.jpg'}
                    width={64}
                    height={64}
                    className="rounded-md"
                  />
                  <div className="flex flex-col justify-center">
                    <span>{playlist.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-x-20">
                  <span className="text-white/80">{playlist.tracks.total}</span>
                  <span className="text-white/80">{playlist.owner.display_name}</span>
                  <div
                    onClick={(e) => e.preventDefault()}
                    className="hover:bg-white/10 p-1 rounded"
                  >
                    <DotsThreeVertical className="text-white/80 " />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

Playlists.getLayout = (page: ReactElement) => {
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

export default Playlists;
