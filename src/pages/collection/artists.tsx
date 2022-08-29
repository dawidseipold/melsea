// Layouts
import MainLayout, { useToken } from '../../layouts/MainLayout';
import CollectionLayout, { useMode } from '../../layouts/CollectionLayout';

// Functions
import { getSession } from 'next-auth/react';

// Types
import { ReactElement, useEffect, useState } from 'react';
import { getAccessToken, getUserArtists, getUserShows } from '../../lib/spotify';
import { useRouter } from 'next/router';
import Dropdown from '../../components/utils/Dropdown/Dropdown';
import Card from '../../components/common/Card/Card';
import { Trash } from 'phosphor-react';

interface IPodcasts {
  artists: any;
  token: string;
}

const Artists = ({ artists, token }: IPodcasts) => {
  const setToken = useToken((state) => state.setToken);

  const [loading, setLoading] = useState(true);
  const mode = useMode((state) => state.mode);

  const router = useRouter();

  useEffect(() => {
    setToken(token);
    console.log(artists);
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
        {artists.items.length > 0 ? (
          artists.items.map((artist) => {
            return (
              <Dropdown
                key={artist.id}
                onContextMenu={true}
                button={
                  <Card
                    data={artist}
                    type="person"
                    prefix={'artist'}
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
          <div>No Artists here :(</div>
        )}
      </div>
    </div>
  );
};

Artists.getLayout = (page: ReactElement) => {
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

  const responseArtists = await getUserArtists(token);
  const { artists } = await responseArtists.json();

  return {
    props: { artists, token },
  };
}

export default Artists;
