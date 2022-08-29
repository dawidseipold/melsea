import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { DotsThreeOutlineVertical, Share } from 'phosphor-react';
import { ReactElement, useEffect, useState } from 'react';
import { usePalette } from 'react-palette';
import Error from '../../components/layout/Error/Error';
import Dropdown from '../../components/utils/Dropdown/Dropdown';
import MainLayout, { useToken } from '../../layouts/MainLayout';
import { getAccessToken, getUserProfile } from '../../lib/spotify';
import { getRecentlyPlayedTracks } from '../../lib/spotify';

const User = ({ user, token, error }) => {
  if (error) {
    console.log(error);

    return <Error code={error.code} message={error.message} />;
  }

  const setToken = useToken((state) => state.setToken);
  const router = useRouter();
  const { data: colors } = usePalette(user.images[0] ? user.images[0].url : '/background-1.jpg');

  // const [followed, setFollowed] = useState(artist.followed);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setToken(token);
    console.log(user);

    setLoading(false);
  }, []);

  // useEffect(() => {
  //   Object.assign(artist, { followed: followed });
  // }, [followed]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="bg-top p-8 bg-no-repeat flex flex-col gap-y-24 relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${colors.vibrant}, transparent)`,
        backgroundSize: 'auto 296px',
      }}
    >
      <div className="flex gap-x-8 bg-cover rounded-b-2xl bg-center h-52">
        <div className="h-full w-max relative aspect-square">
          <Image
            src={user.images[0] ? user.images[0].url : '/background-1.jpg'}
            layout="fixed"
            width={208}
            height={208}
            objectFit="cover"
            className="rounded-lg"
            priority
          />
        </div>

        <div className="flex flex-col gap-y-2 w-full">
          <h1 className="font-extrabold tracking-wide drop-shadow-xl text-6xl ">
            {user.display_name}
          </h1>

          <div className="flex justify-between items-end mt-auto">
            <div className="flex">
              <div className="flex items-center gap-x-4">
                {/* <div
                  className={`capitalize font-semibold px-4 py-2 rounded-xl outline outline-1  w-max flex items-center gap-x-2 cursor-pointer ${
                    followed
                      ? 'outline-white hover:outline-white/60'
                      : 'outline-white/60 hover:outline-white'
                  }`}
                  onClick={() => {
                    useArtistFollow(artist.id, token, followed);
                    setFollowed((prev) => !prev);
                  }}
                >
                  {followed ? 'following' : 'follow'}
                </div> */}
                <span className="text-base">{user.followers.total} followers</span>
              </div>
            </div>

            <div className="flex items-center gap-x-4">
              <Dropdown
                button={<DotsThreeOutlineVertical size={24} weight="fill" />}
                buttonWrapper={true}
                position="center"
                items={[
                  [
                    {
                      icon: <Share size={20} />,
                      name: 'Share',
                      onClick: () => {
                        navigator.clipboard.writeText(
                          `${process.env.NEXT_PUBLIC_URL}${router.asPath}`
                        );
                      },
                    },
                  ],
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

User.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const id = context.params.id;
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

  // Get User Data

  const responseUserData = await getUserProfile(token, id);
  const error = responseUserData.ok
    ? false
    : { code: responseUserData.status, message: responseUserData.statusText };

  if (!error) {
    const user = await responseUserData.json();

    return {
      props: { user, token },
    };
  }

  return {
    props: { error },
  };
};

export default User;
