// Layouts
import MainLayout, { useToken } from '../../layouts/MainLayout';
import CollectionLayout, { useMode } from '../../layouts/CollectionLayout';

// Functions
import { getSession } from 'next-auth/react';

// Types
import { ReactElement, useEffect, useState } from 'react';
import { getAccessToken, getUserShows } from '../../lib/spotify';
import { useRouter } from 'next/router';
import Dropdown from '../../components/utils/Dropdown/Dropdown';
import Card from '../../components/common/Card/Card';
import { Trash } from 'phosphor-react';

interface IPodcasts {
  shows: any;
  token: string;
}

const Podcasts = ({ shows, token }: IPodcasts) => {
  const setToken = useToken((state) => state.setToken);

  const [loading, setLoading] = useState(true);
  const mode = useMode((state) => state.mode);

  const router = useRouter();

  useEffect(() => {
    console.log(shows);

    setToken(token);
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
        {shows.items.length > 0 ? (
          shows.items.map((show) => {
            return (
              <Dropdown
                key={show.id}
                onContextMenu={true}
                button={
                  <Card
                    data={show}
                    prefix={'show'}
                    direction={mode === 'horizontal' ? 'horizontal' : 'vertical'}
                  />
                }
                items={[
                  [
                    {
                      icon: <Trash size={20} />,
                      name: 'Remove',
                      onClick: () => {
                        // removePlaylist(token, playlist.id);
                        router.replace(router.asPath);
                      },
                    },
                  ],
                ]}
              />
            );
          })
        ) : (
          <div>No podcasts here :(</div>
        )}
      </div>
    </div>
  );
};

Podcasts.getLayout = (page: ReactElement) => {
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

  // Get Podcasts Data

  const responseShows = await getUserShows(token);
  const shows = await responseShows.json();

  return {
    props: { shows, token },
  };
}

export default Podcasts;
