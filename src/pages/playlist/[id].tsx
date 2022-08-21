// Components
import Image from 'next/image';
import Length from '../../components/utils/Length/Length';
import Link from 'next/link';
import List from '../../components/common/List/List';
import Error from '../../components/layout/Error/Error';

// Layouts
import MainLayout, { useToken } from '../../layouts/MainLayout';

// Hooks
import { useState, useEffect } from 'react';
import { usePalette } from 'react-palette';

// Functions
import { getPlaylist } from '../api/playlists/[id]';
import { getSession, useSession } from 'next-auth/react';
import getAccessToken, { getPlaylistTracks, isLoved, removePlaylist } from '../../lib/spotify';

// Types
import type { ReactElement } from 'react';
import type { Playlist } from '../../../types/spotify/playlist';
import type { ErrorResponse } from '../../../types/utils';

// Icons
import { DotsThreeOutlineVertical, Play, Shuffle, Trash } from 'phosphor-react';
import { Menu } from '@headlessui/react';
import Dropdown from '../../components/utils/Dropdown/Dropdown';
import { Router, useRouter } from 'next/router';

interface IPlaylist {
  playlist: Playlist;
  tracks: any;
  token: string;
  error: ErrorResponse;
}

const Playlist = ({ error, playlist, tracks, token }: IPlaylist) => {
  if (error) {
    console.log(error);

    return <Error code={error.code} message={error.message} />;
  }

  const setToken = useToken((state) => state.setToken);

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [length, setLength] = useState<number>();
  const { data: session } = useSession();

  const { data: colors } = usePalette(
    playlist.images[0] ? playlist.images[0].url : '/background-1.jpg'
  );

  let count = 1;

  useEffect(() => {
    setToken(token);
    setLoading(false);

    let duration = 0;
    for (let item of tracks.items) {
      duration += item.track.duration_ms;
    }
    setLength(duration);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="p-8 bg-top bg-no-repeat flex flex-col gap-y-24 relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${colors.vibrant}, transparent)`,
        backgroundSize: 'auto 296px',
      }}
    >
      <div className="flex gap-x-8 bg-cover rounded-b-2xl bg-center h-52">
        <div className="h-full w-max relative aspect-square">
          <Image
            src={playlist.images[0] ? playlist.images[0].url : '/background-1.jpg'}
            layout="fixed"
            width={208}
            height={208}
            objectFit="cover"
            className="rounded-lg"
            priority
          />
        </div>

        <div className="flex flex-col gap-y-2 w-full">
          <h1 className="font-extrabold tracking-wide drop-shadow-xl text-4xl ">{playlist.name}</h1>
          {playlist.owner.id !== 'spotify' && playlist.description ? (
            <span className="text-white/75 block mt-2">{playlist.description}</span>
          ) : null}

          <div className="flex justify-between items-end mt-auto">
            <div className="flex">
              <Link href={`/user/${playlist.owner.id}`}>
                <a className="font-medium hover:underline">{playlist.owner.display_name}</a>
              </Link>

              <div className="flex items-center before:content-['\2022'] before:mx-2">
                <span>{tracks.total} songs,</span>
                <Length as="div" milliseconds={parseInt(length)} className="ml-2" />
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
                      icon: <Trash size={20} />,
                      name: 'Remove',
                      onClick: () => {
                        removePlaylist(token, playlist.id);
                        router.push('/', undefined, { shallow: true });
                      },
                    },
                  ],
                ]}
              />

              <div className="p-2 hover:bg-white/20 rounded-full cursor-pointer">
                <Shuffle size={24} weight="fill" />
              </div>

              <div className="px-4 py-2 rounded-xl bg-white w-max flex items-center gap-x-2 cursor-pointer hover:bg-white/90">
                <Play size={20} weight="fill" className="text-dark-background-primary" />
                <span className="text-dark-background-primary font-bold select-none">Play</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {tracks.total > 0 ? (
        <div>
          <ul className="flex flex-col gap-y-2">
            {tracks.items.map((item) => {
              if (item.track.href !== null) {
                return (
                  <List
                    key={item.track.id}
                    item={item}
                    count={count++}
                    token={token}
                    fields={{
                      cover: true,
                      name: { title: true, artist: true },
                      album: true,
                      date: true,
                      info: { loved: true, length: true },
                    }}
                  />
                );
              }
            })}
          </ul>
        </div>
      ) : (
        <div>Add songs to the playlist - wyswietl polecane piosenki</div>
      )}
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

  // Playlist Data
  const responsePlaylist = await getPlaylist(accessToken, id);
  const error = responsePlaylist.ok
    ? false
    : { code: responsePlaylist.status, message: responsePlaylist.statusText };

  if (!error) {
    const playlist = await responsePlaylist.json();
    // Playlist Tracks Data

    const responsePlaylistTracks = await getPlaylistTracks(accessToken, id);
    const tracks = await responsePlaylistTracks.json();

    // Tracks Loved Status Data
    let ids = tracks.items.map((item) => item.track.id);

    const responseLoved = await isLoved(accessToken, ids.join(','));
    const loved = await responseLoved.json();

    tracks.items.forEach((item, index) => {
      Object.assign(item, { track: { ...item.track, loved: loved[index] } });
    });

    // Get Token
    const { access_token: token } = await getAccessToken(accessToken);

    return { props: { playlist, tracks, token } };
  }

  return { props: { error } };
}

export default Playlist;
