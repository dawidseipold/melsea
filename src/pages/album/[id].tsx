import { format, parse } from 'date-fns';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DotsThreeOutlineVertical, Heart, Play, Share } from 'phosphor-react';
import React, { ReactElement, useEffect, useState } from 'react';
import { usePalette } from 'react-palette';
import { ErrorResponse } from '../../../types/utils';
import List from '../../components/common/List/List';
import Error from '../../components/layout/Error/Error';
import Dropdown from '../../components/utils/Dropdown/Dropdown';
import Length from '../../components/utils/Length/Length';
import MainLayout, { useToken } from '../../layouts/MainLayout';
import getAccessToken, { getAlbum, isLoved, useLoved } from '../../lib/spotify';
import Artist from '../artist/[id]';

interface IAlbum {
  album: any;
  token: string;
  error: ErrorResponse;
}

const Album = ({ album, token, error }: IAlbum) => {
  if (error) {
    console.log(error);

    return <Error code={error.code} message={error.message} />;
  }

  const setToken = useToken((state) => state.setToken);
  const router = useRouter();
  const { data: colors } = usePalette(album.images[0] ? album.images[0].url : '/background-1.jpg');

  const [loved, setLoved] = useState<boolean>(album.loved);
  const [loading, setLoading] = useState<boolean>(true);
  const [length, setLength] = useState<number>(0);

  let count = 1;

  useEffect(() => {
    console.log(album);
    setToken(token);

    let duration = 0;
    for (let track of album.tracks.items) {
      duration += track.duration_ms;
    }
    setLength(duration);

    setLoading(false);
  }, []);

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
            src={album.images[0] ? album.images[0].url : '/background-1.jpg'}
            layout="fixed"
            width={208}
            height={208}
            objectFit="cover"
            className="rounded-lg"
            priority
          />
        </div>

        <div className="flex flex-col gap-y-2 w-full">
          <h1 className="font-extrabold tracking-wide drop-shadow-xl text-6xl ">{album.name}</h1>

          <div className="flex justify-between items-end mt-auto">
            <div className="flex">
              {album.artists.map((artist) => (
                <React.Fragment key={artist.id}>
                  <Link href={`/artist/${artist.id}`}>
                    <a className="text-base hover:underline">{artist.name}</a>
                  </Link>

                  <span className="mx-2">&#8226;</span>
                </React.Fragment>
              ))}

              <div className="flex items-center">
                <span>{album.release_year}</span>
                <span className="mx-2">&#8226;</span>
                <span>{album.tracks.total} songs,</span>
                <Length as="div" milliseconds={length} className="ml-2" />
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
                  useLoved(token, 'albums', album.id, loved);
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

      <ul className="flex flex-col gap-y-2">
        {album.tracks.items.map((track) => {
          if (track.href !== null) {
            return (
              <List
                key={track.id}
                track={track}
                count={count++}
                token={token}
                fields={{
                  cover: false,
                  name: { title: true, artist: true },
                  album: false,
                  date: false,
                  info: { loved: true, length: true },
                }}
              />
            );
          }
        })}
      </ul>
    </div>
  );
};

Album.getLayout = (page: ReactElement) => {
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

  // Album Data

  const responseAlbum = await getAlbum(token, id);
  const error = responseAlbum.ok
    ? false
    : { code: responseAlbum.status, message: responseAlbum.statusText };

  if (!error) {
    const album = await responseAlbum.json();

    // Track Loved Status Data

    const responseAlbumLoved = await isLoved(accessToken, 'albums', id);
    const albumLoved = await responseAlbumLoved.json();

    Object.assign(album, { loved: albumLoved[0] });

    // Add Album Release Year

    Object.assign(album, {
      release_year: format(parse(album.release_date, 'yyyy-MM-dd', new Date()), 'yyyy'),
    });

    return {
      props: {
        album,
        token,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default Album;
