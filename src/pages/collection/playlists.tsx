// Components
import Card from '../../components/common/Card/Card';

// Layouts
import MainLayout, { useToken } from '../../layouts/MainLayout';

// Functions
import { getAccessToken, removePlaylist } from '../../lib/spotify';
import { getSession } from 'next-auth/react';
import { getUsersPlaylists } from '../api/playlists';

// Hooks
import { useEffect, useState } from 'react';

// Types
import type { NextPageWithLayout } from '../_app';
import type { ReactElement } from 'react';
import Link from 'next/link';
import { RadioGroup, Switch } from '@headlessui/react';
import { Trash } from 'phosphor-react';
import Dropdown from '../../components/utils/Dropdown/Dropdown';
import { useRouter } from 'next/router';
import CollectionLayout, { useMode } from '../../layouts/CollectionLayout';

interface IPlaylists {}

const Playlists: NextPageWithLayout = ({ playlists, token }: IPlaylists) => {
  const setToken = useToken((state) => state.setToken);

  const [loading, setLoading] = useState(true);
  const mode = useMode((state) => state.mode);

  const router = useRouter();

  useEffect(() => {
    setToken(token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* <div className="flex justify-center items-center gap-x-8">
        {featured.map((item) => (
          <Link href="/collection/playlists">
            <a className="flex-1">
              <div
                className="flex flex-col pt-24 px-8 pb-12 rounded-2xl gap-y-2"
                style={{
                  backgroundImage: `url(/background-${Math.floor(Math.random() * 9) + 1}.jpg)`,
                }}
              >
                <span className="font-semibold text-sm">Playlist generated because:</span>
                <h2 className="font-bold text-4xl">Playlist Name</h2>
              </div>
            </a>
          </Link>
        ))}
      </div> */}

      <div
        className={`grid ${
          mode === 'horizontal' ? 'grid-cols-fluid-horizontal' : 'grid-cols-fluid-vertical'
        } justify-start gap-6`}
      >
        {playlists.items.map((playlist) => {
          return (
            <Dropdown
              key={playlist.id}
              onContextMenu={true}
              button={
                <Card
                  data={playlist}
                  prefix={'playlist'}
                  direction={mode === 'horizontal' ? 'horizontal' : 'vertical'}
                />
              }
              items={[
                [
                  {
                    icon: <Trash size={20} />,
                    name: 'Remove',
                    onClick: () => {
                      removePlaylist(token, playlist.id);
                      router.replace(router.asPath);
                    },
                  },
                ],
              ]}
            />
          );
        })}
      </div>
    </div>
  );
};

Playlists.getLayout = (page: ReactElement) => {
  return (
    <MainLayout>
      <CollectionLayout>{page}</CollectionLayout>
    </MainLayout>
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

  const response = await getUsersPlaylists(accessToken);
  const playlists = await response.json();

  const { access_token: token } = await getAccessToken(accessToken);

  return {
    props: { playlists, token },
  };
}

export default Playlists;
