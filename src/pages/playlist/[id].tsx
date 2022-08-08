// Components
import { Switch } from '@headlessui/react';
import Image from 'next/image';
import Length from '../../components/utils/Length/Length';
import Link from 'next/link';

// Layouts
import MainLayout from '../../layouts/MainLayout';

// Hooks
import { useState, useEffect } from 'react';
import { usePalette } from 'react-palette';

// Functions
import { getPlaylist } from '../api/playlists/[id]';
import { getSession, useSession } from 'next-auth/react';
import { normalizeAgo } from '../../utils';

// Types
import type { ReactElement } from 'react';
import type { Item, Playlist } from '../../../types/spotify/playlist';

// Icons
import { DotsThreeOutlineVertical, DotsThreeVertical, Heart, Play } from 'phosphor-react';
import getAccessToken from '../../lib/spotify';
import { setTimeDuration } from '../../utils/time';

interface IPlaylist {
  playlist: Playlist;
}

const Playlist = ({ playlist }: IPlaylist) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [length, setLength] = useState<number>();
  const { data: session } = useSession();

  const { data: colors } = usePalette(playlist ? playlist?.images[0].url : '');

  let count = 1;

  useEffect(() => {
    setLoading(false);

    let duration = 0;
    for (let item of playlist.tracks.items) {
      duration += item.track.duration_ms;
    }
    setLength(duration);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="p-8 bg-top bg-no-repeat flex flex-col gap-y-24"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${colors.vibrant}, transparent)`,
        backgroundSize: 'auto 296px',
      }}
    >
      <div className="flex gap-x-8 bg-cover rounded-b-2xl bg-center h-52">
        <div className="h-full w-full relative max-w-[370px] aspect-square">
          <Image
            src={playlist?.images[0].url}
            width="100%"
            height="100%"
            layout="fill"
            objectFit="cover"
            className="rounded-lg "
          />
        </div>

        <div className="flex flex-col gap-y-2 w-full">
          <h1 className="font-extrabold tracking-wide drop-shadow-xl text-4xl ">{playlist.name}</h1>
          {playlist.description ? (
            <span className="text-white/75 block mt-2">{playlist.description}</span>
          ) : null}

          <div className="flex justify-between items-end mt-auto">
            <div className="flex">
              <Link href={`/user/${playlist.owner.id}`}>
                <a className="font-medium hover:underline">{playlist.owner.display_name}</a>
              </Link>

              <div className="flex items-center before:content-['•'] before:mx-2">
                <span>{playlist.tracks.items.length} songs,</span>
                <Length as="div" milliseconds={parseInt(length)} className="ml-2" />
              </div>
            </div>

            <div className="flex items-center gap-x-4">
              <div className="p-2 hover:bg-white/20 rounded-full cursor-pointer">
                <DotsThreeOutlineVertical size={24} weight="fill" />
              </div>

              <div className="px-4 py-2 rounded-xl bg-white w-max flex items-center gap-x-2 cursor-pointer hover:bg-white/90">
                <Play size={20} weight="fill" className="text-dark-background-primary" />
                <span className="text-dark-background-primary font-bold select-none">Play</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <ul className="flex flex-col gap-y-2">
          {playlist.tracks.items.map((item) => {
            if (item.track.href !== null) {
              return (
                <li
                  className="grid gap-x-4 justify-between items-center px-4 py-2 hover:bg-dark-background-secondary rounded-lg group"
                  style={{
                    gridTemplateColumns: '16px 50% 20fr 20fr auto',
                  }}
                >
                  <div className="flex items-center w-4 justify-center text-center">
                    <span className="text-white/80 group-hover:hidden">{count++}</span>
                    <Play className="text-white/80 hidden group-hover:block" weight="fill" />
                  </div>

                  <div className="flex gap-x-4 items-center">
                    <Image
                      src={item.track.album?.images[2].url}
                      layout="fixed"
                      width={48}
                      height={48}
                      className="rounded-md"
                    />
                    <div className="flex flex-col justify-center">
                      <Link href={`/track/${item.track.id}`}>
                        <a className="hover:underline truncate">{item.track.name}</a>
                      </Link>

                      <div className="flex gap-x-1">
                        {item.track.artists.map((artist) => (
                          <Link href={`/artist/${artist.id}`}>
                            <a
                              className={`hover:underline text-sm text-white/80 after:content-[','] last:after:content-none`}
                            >
                              {artist.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link href={`/album/${item.track.album.id}`}>
                    <a className="text-white/80 truncate hover:underline">
                      {item.track.album.name}
                    </a>
                  </Link>

                  <span className="text-white/80">{normalizeAgo(item.added_at)}</span>

                  <div className="flex items-center gap-x-4">
                    <Heart
                      className="text-white/80 mr-4"
                      weight={item.track.loved ? 'fill' : 'regular'}
                    />
                    <span className="text-white/80 ">
                      {JSON.stringify(setTimeDuration(item.track.duration_ms))}
                    </span>
                    <div
                      onClick={(e) => e.preventDefault()}
                      className="hover:bg-white/10 p-1 rounded-full invisible group-hover:visible"
                    >
                      <DotsThreeVertical className="text-white/80 " />
                    </div>
                  </div>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
};

Playlist.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps(context) {
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

  const {
    token: { accessToken },
  } = session;

  const response = await getPlaylist(accessToken, id);
  const playlist: Playlist = await response.json();

  const checkSaved = async (refresh_token: string, id: string) => {
    const { access_token } = await getAccessToken(refresh_token);
    return await fetch(`https://api.spotify.com/v1/me/tracks/contains/?ids=${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  };

  for (let item of playlist.tracks.items) {
    const response = await checkSaved(accessToken, item.track.id);

    const data = await response.json();

    Object.assign(item, {
      track: { ...item.track, loved: data[0] },
    });
  }

  return { props: { playlist } };
}

export default Playlist;
