import { format, parse } from 'date-fns';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Error from 'next/error';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DotsThreeOutlineVertical, Heart, Play, Share } from 'phosphor-react';
import React, { ReactElement, useEffect, useState } from 'react';
import { usePalette } from 'react-palette';
import List from '../../components/common/List/List';
import Dropdown from '../../components/utils/Dropdown/Dropdown';
import MainLayout, { useToken } from '../../layouts/MainLayout';
import getAccessToken, { getAlbumTracks, getTrack, isLoved, useLoved } from '../../lib/spotify';
import { stringifyLength } from '../../utils';

interface ITrack {
  track: any;
  albumTracks: any;
  token: string;
  error: any;
}

const Track = ({ track, albumTracks, token, error }: ITrack) => {
  if (error) {
    console.log(error);

    return <Error code={error.code} message={error.message} />;
  }

  const setToken = useToken((state) => state.setToken);
  const router = useRouter();
  const { data: colors } = usePalette(
    track.album.images[0] ? track.album.images[0].url : '/background-1.jpg'
  );

  const [loved, setLoved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  let count = 1;

  useEffect(() => {
    setToken(token);
    setLoved(track.loved);
    console.log(track);
    console.log(albumTracks);

    setLoading(false);
  }, []);

  useEffect(() => {
    setLoved(track.loved);
  }, [router]);

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
            src={track.album.images[0] ? track.album.images[0].url : '/background-1.jpg'}
            layout="fixed"
            width={208}
            height={208}
            objectFit="cover"
            className="rounded-lg"
            priority
          />
        </div>

        <div className="flex flex-col gap-y-2 w-full">
          <h1 className="font-extrabold tracking-wide drop-shadow-xl text-6xl ">{track.name}</h1>

          <div className="flex justify-between items-end mt-auto">
            <div className="flex">
              <div className="flex items-center">
                {track.artists.map((artist) => (
                  <React.Fragment key={artist.id}>
                    <Link href={`/artist/${artist.id}`}>
                      <a className="text-base hover:underline">{artist.name}</a>
                    </Link>

                    <span className="mx-2">&#8226;</span>
                  </React.Fragment>
                ))}
                <span className="after:content-['\002C'] after:mr-2">
                  {track.album.release_year}
                </span>
                <span>{stringifyLength({ start: 0, end: track.duration_ms })}</span>
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

              <Heart
                size={28}
                onClick={() => {
                  setLoved((prev) => !prev);
                  useLoved(token, 'tracks', track.id, track.loved);
                }}
                className="text-white/80 mr-4 hover:text-white cursor-pointer"
                weight={loved ? 'fill' : 'regular'}
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

      {track.artists.map((artist) => (
        <div key={artist.id} className="flex flex-col gap-y-8">
          <div>
            <span className="text-white/60">Popular Tracks by</span>
            <h2 className="font-semibold text-2xl">{artist.name}</h2>
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-y-2">
        <Link href={`/album/${track.album.id}`}>
          <a className="flex items-center gap-x-4 bg-dark-background-secondary hover:bg-dark-background-elevation rounded-xl p-2">
            <Image src={track.album.images[0].url} width={96} height={96} className="rounded-lg" />

            <div>
              <span className="text-white/60">From the {track.album.album_type}</span>
              <h3 className="text-xl font-semibold">{track.album.name}</h3>
            </div>
          </a>
        </Link>

        {track.album.album_type === 'single' ? (
          <List
            token={token}
            count={count}
            track={track}
            fields={{
              cover: false,
              name: { title: true, artist: true },
              album: false,
              date: false,
              info: { loved: true, length: true },
            }}
          />
        ) : (
          albumTracks.items.map((track) => (
            <List
              key={track.id}
              token={token}
              count={count++}
              track={track}
              fields={{
                cover: false,
                name: { title: true, artist: true },
                album: false,
                date: false,
                info: { loved: true, length: true },
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

Track.getLayout = (page: ReactElement) => {
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

  // Track Data

  const responseTrack = await getTrack(token, id);
  const error = responseTrack.ok
    ? false
    : { code: responseTrack.status, message: responseTrack.statusText };

  if (!error) {
    const track = await responseTrack.json();

    // Track Loved Status Data
    const responseLoved = await isLoved(accessToken, 'tracks', id);
    const loved = await responseLoved.json();

    Object.assign(track, { loved: loved[0] });

    // Add release year

    Object.assign(track, {
      album: {
        ...track.album,
        release_year: format(parse(track.album.release_date, 'yyyy-MM-dd', new Date()), 'yyyy'),
      },
    });

    // Get track album

    if (track.album.album_type !== 'single') {
      const responseAlbumTracks = await getAlbumTracks(token, track.album.id);
      const albumTracks = await responseAlbumTracks.json();

      // Album Tracks Loved Status Data
      let ids = albumTracks.items.map((track) => track.id);

      const responseLoved = await isLoved(accessToken, 'tracks', ids.join(','));
      const loved = await responseLoved.json();

      albumTracks.items.forEach((track, index) => {
        Object.assign(track, { loved: loved[index] });
      });

      return {
        props: { track, albumTracks, token },
      };
    }

    return {
      props: { track, token },
    };
  }

  return {
    props: {
      error,
    },
  };
};

export default Track;
