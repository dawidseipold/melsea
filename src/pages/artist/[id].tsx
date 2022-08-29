import { format, parse } from 'date-fns';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { DotsThreeOutlineVertical, Play, Share, Trash } from 'phosphor-react';
import { ReactElement, useEffect, useState } from 'react';
import { usePalette } from 'react-palette';
import { ErrorResponse } from '../../../types/utils';
import Card from '../../components/common/Card/Card';
import List from '../../components/common/List/List';
import Error from '../../components/layout/Error/Error';
import Dropdown from '../../components/utils/Dropdown/Dropdown';
import MainLayout, { useToken } from '../../layouts/MainLayout';
import {
  getAccessToken,
  checkArtistFollow,
  getArtist,
  getArtistDiscography,
  getArtistFeatures,
  getArtistTracks,
  isLoved,
  useArtistFollow,
} from '../../lib/spotify';

interface IArtist {
  error: ErrorResponse;
  artist: any;
  tracks: any;
  discography: any;
  features: any;
  token: string;
}

const Artist = ({ error, artist, tracks, discography, features, token }: IArtist) => {
  if (error) {
    console.log(error);

    return <Error code={error.code} message={error.message} />;
  }

  const setToken = useToken((state) => state.setToken);
  const router = useRouter();
  const { data: colors } = usePalette(
    artist.images[0] ? artist.images[0].url : '/background-1.jpg'
  );

  const [followed, setFollowed] = useState(artist.followed);
  const [loading, setLoading] = useState<boolean>(true);

  let count = 1;

  useEffect(() => {
    setToken(token);
    setLoading(false);
  }, []);

  useEffect(() => {
    Object.assign(artist, { followed: followed });
  }, [followed]);

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
            src={artist.images[0] ? artist.images[0].url : '/background-1.jpg'}
            layout="fixed"
            width={208}
            height={208}
            objectFit="cover"
            className="rounded-lg"
            priority
          />
        </div>

        <div className="flex flex-col gap-y-2 w-full">
          <h1 className="font-extrabold tracking-wide drop-shadow-xl text-6xl ">{artist.name}</h1>

          <div className="flex justify-between items-end mt-auto">
            <div className="flex">
              <div className="flex items-center gap-x-4">
                <div
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
                </div>
                <span className="text-base">{artist.followers.total} followers</span>
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

              <div className="px-4 py-2 rounded-xl bg-white w-max flex items-center gap-x-2 cursor-pointer hover:bg-white/90">
                <Play size={20} weight="fill" className="text-dark-background-primary" />
                <span className="text-dark-background-primary font-bold select-none capitalize">
                  play
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {tracks.length > 0 ? (
        <div className="flex flex-col gap-y-8">
          <h2 className="font-semibold text-2xl">Popular Songs</h2>

          <ul className="flex flex-col gap-y-2">
            {tracks.map((track) => {
              if (track.href !== null) {
                return (
                  <List
                    key={track.id}
                    track={track}
                    count={count++}
                    token={token}
                    fields={{
                      cover: true,
                      name: { title: true, artist: false },
                      album: true,
                      date: false,
                      info: { loved: true, length: true },
                    }}
                  />
                );
              }
            })}
          </ul>
        </div>
      ) : (
        <div>This artist doesn't have any songs - Display other artists</div>
      )}

      {discography.total > 0 ? (
        <div className="flex flex-col gap-y-8">
          <h2 className="font-semibold text-2xl">Discography</h2>

          <div className="grid grid-cols-fluid-vertical justify-start gap-6">
            {discography.items.map((item) => {
              return (
                <Dropdown
                  key={item.id}
                  onContextMenu={true}
                  button={<Card data={item} prefix={item.type} direction={'vertical'} />}
                  items={[
                    [
                      {
                        icon: <Trash size={20} />,
                        name: 'Remove',
                        onClick: () => {
                          console.log('hi');
                        },
                      },
                    ],
                  ]}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div>{artist.name} doesn't have any albums, singles...</div>
      )}

      {features.total > 0 ? (
        <div className="flex flex-col gap-y-8">
          <h2 className="font-semibold text-2xl">Features</h2>

          <div className="grid grid-cols-fluid-vertical justify-start gap-6">
            {features.items.map((feature) => {
              return (
                <Dropdown
                  key={feature.id}
                  onContextMenu={true}
                  button={<Card data={feature} prefix={feature.type} direction={'vertical'} />}
                  items={[
                    [
                      {
                        icon: <Trash size={20} />,
                        name: 'Remove',
                        onClick: () => {
                          console.log('hi');
                        },
                      },
                    ],
                  ]}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div>{artist.name} doesn't have any features, yet...</div>
      )}
    </div>
  );
};

Artist.getLayout = (page: ReactElement) => {
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

  // Get Country Code

  const responseCountryCode = await fetch(`https://ipinfo.io/json?token=dac6080fcca47f`);
  const { country } = await responseCountryCode.json();

  // Get Token

  const {
    token: { accessToken },
  } = session;

  const { access_token: token } = await getAccessToken(accessToken);

  // Artist Data

  const responseArtist = await getArtist(token, id);
  const error = responseArtist.ok
    ? false
    : { code: responseArtist.status, message: responseArtist.statusText };

  if (!error) {
    const artist = await responseArtist.json();

    // Get Artist's Tracks

    const responseTracks = await getArtistTracks(token, id, country);
    const { tracks } = await responseTracks.json();

    // Tracks Loved Status Data
    let ids = tracks.map((track) => track.id);

    const responseLoved = await isLoved(accessToken, 'tracks', ids.join(','));
    const loved = await responseLoved.json();

    tracks.forEach((track, index) => {
      Object.assign(track, { loved: loved[index] });
    });

    // Get Artist's Discography

    const responseDiscography = await getArtistDiscography(token, id);
    const discography = await responseDiscography.json();

    discography.items.forEach((item, index) => {
      Object.assign(item, {
        release_year:
          item.release_date.length > 4
            ? format(parse(item.release_date, 'yyyy-MM-dd', new Date()), 'yyyy')
            : item.release_date,
      });
    });

    discography.items.sort((a, b) => Date.parse(b.release_date) - Date.parse(a.release_date));

    // Get Artist's Features

    const responseFeatures = await getArtistFeatures(token, id);
    const features = await responseFeatures.json();

    features.items.forEach((item, index) => {
      Object.assign(item, {
        release_year:
          item.release_date.length > 4
            ? format(parse(item.release_date, 'yyyy-MM-dd', new Date()), 'yyyy')
            : item.release_date,
      });
    });

    // Artist Followed Status Data

    const responseFollowed = await checkArtistFollow(accessToken, id);
    const followed = await responseFollowed.json();

    Object.assign(artist, { followed: followed[0] });

    return { props: { artist, tracks, discography, features, token } };
  }

  return {
    props: {
      error,
    },
  };
};

export default Artist;
