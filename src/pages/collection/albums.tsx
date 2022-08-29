// Layouts
import MainLayout, { useToken } from '../../layouts/MainLayout';
import CollectionLayout, { useMode } from '../../layouts/CollectionLayout';

// Functions
import { getSession } from 'next-auth/react';

// Types
import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Dropdown from '../../components/utils/Dropdown/Dropdown';
import Card from '../../components/common/Card/Card';
import { Trash } from 'phosphor-react';
import { getAccessToken, getUserAlbums } from '../../lib/spotify';

interface IAlbums {
  albums: any;
  token: string;
}

const Albums = ({ albums, token }: IAlbums) => {
  const setToken = useToken((state) => state.setToken);

  const [loading, setLoading] = useState(true);
  const mode = useMode((state) => state.mode);

  const router = useRouter();

  useEffect(() => {
    setToken(token);
    console.log(albums);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div
        className={`grid ${
          mode === 'horizontal' ? 'grid-cols-fluid-horizontal' : 'grid-cols-fluid-vertical'
        } justify-start gap-6`}
      >
        {albums.items.map(({ album }) => {
          return (
            <Dropdown
              key={album.id}
              onContextMenu={true}
              button={
                <Card
                  data={album}
                  prefix={'album'}
                  direction={mode === 'horizontal' ? 'horizontal' : 'vertical'}
                />
              }
              items={[
                [
                  {
                    icon: <Trash size={20} />,
                    name: 'Remove',
                    onClick: () => {
                      // removealbum(token, album.id);
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

Albums.getLayout = (page: ReactElement) => {
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

  // Get Token

  const {
    token: { accessToken },
  } = session;

  const { access_token: token } = await getAccessToken(accessToken);

  // Get Artists Data

  const responseAlbums = await getUserAlbums(token);
  const albums = await responseAlbums.json();

  return {
    props: { albums, token },
  };
}

export default Albums;
