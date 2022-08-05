// Components
import Head from 'next/head';
import Image from 'next/image';

// Hooks
import { useEffect, useState } from 'react';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Icons
import { Heart, Play } from 'phosphor-react';

// Types
import type { NextPageWithLayout } from './_app';
import { ReactElement } from 'react';

interface IHome {}

const Home: NextPageWithLayout = ({}: IHome) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let resPlaylists = await fetch('/api/playlists');
        let resTracks = await fetch('/api/tracks');

        if (resPlaylists.status === 200 && resTracks.status === 200) {
          let { items: playlists } = await resPlaylists.json();
          let { items: tracks } = await resTracks.json();

          setData({ playlists, tracks });

          setLoading(false);
        } else {
          throw 'Error fetching users list';
        }
      } catch (error) {
        throw `${error}`;
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(data);

  return (
    <section className="w-full flex flex-col gap-y-12">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2 justify-between ">
          <h2 className="text-lg font-medium">Recently Created Playlists</h2>
          <span className="uppercase text-base text-brand-blue hover:underline cursor-pointer">
            view all
          </span>
        </div>

        <div className="grid gap-x-4 grid-cols-4">
          {data.playlists.slice(0, 4).map((playlist) => (
            <div
              className="aspect-video relative rounded-xl bg-cover bg-center"
              style={{
                backgroundImage: `url(
                  ${playlist.images?.[0] ? `${playlist.images[0].url}` : `background-5.jpg`}
                )`,
              }}
            >
              <div className="p-4 flex flex-col absolute bottom-0">
                <h3 className="text-xl">{playlist.name}</h3>
                <span className="text-md text-white/60">{playlist.tracks.total} songs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <h2 className="text-lg font-medium">Recently Played</h2>

        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between items-center px-4 py-2 hover:bg-dark-background-secondary rounded-lg">
            <div className="flex gap-x-4 items-center">
              <span className="text-white/80">05</span>
              <Image
                src="https://i.imgur.com/Wp4hnLH.jpeg"
                width={64}
                height={64}
                className="rounded-md"
              />
              <div className="flex flex-col justify-center">
                <span>Super Song</span>
                <span className="text-sm text-white/80">Super Author</span>
              </div>
              <Heart className="text-white/80" />
            </div>

            <div className="flex items-center gap-x-20">
              <span className="text-white/80">Super Album</span>
              <span className="text-white/80">12 001 146</span>
              <span className="text-white/80">2:23</span>
              <Play className="text-white/80" />
            </div>
          </div>
          <div className="flex justify-between items-center px-4 py-2 hover:bg-dark-background-secondary rounded-lg">
            <div className="flex gap-x-4 items-center">
              <span className="text-white/80">05</span>
              <Image
                src="https://i.imgur.com/Wp4hnLH.jpeg"
                width={64}
                height={64}
                className="rounded-md"
              />
              <div className="flex flex-col justify-center">
                <span>Super Song</span>
                <span className="text-sm text-white/80">Super Author</span>
              </div>
              <Heart className="text-white/80" />
            </div>

            <div className="flex items-center gap-x-20">
              <span className="text-white/80">Super Album</span>
              <span className="text-white/80">12 001 146</span>
              <span className="text-white/80">2:23</span>
              <Play className="text-white/80" />
            </div>
          </div>
          <div className="flex justify-between items-center px-4 py-2 hover:bg-dark-background-secondary rounded-lg">
            <div className="flex gap-x-4 items-center">
              <span className="text-white/80">05</span>
              <Image
                src="https://i.imgur.com/Wp4hnLH.jpeg"
                width={64}
                height={64}
                className="rounded-md"
              />
              <div className="flex flex-col justify-center">
                <span>Super Song</span>
                <span className="text-sm text-white/80">Super Author</span>
              </div>
              <Heart className="text-white/80" />
            </div>

            <div className="flex items-center gap-x-20">
              <span className="text-white/80">Super Album</span>
              <span className="text-white/80">12 001 146</span>
              <span className="text-white/80">2:23</span>
              <Play className="text-white/80" />
            </div>
          </div>
          <div className="flex justify-between items-center px-4 py-2 hover:bg-dark-background-secondary rounded-lg">
            <div className="flex gap-x-4 items-center">
              <span className="text-white/80">05</span>
              <Image
                src="https://i.imgur.com/Wp4hnLH.jpeg"
                width={64}
                height={64}
                className="rounded-md"
              />
              <div className="flex flex-col justify-center">
                <span>Super Song</span>
                <span className="text-sm text-white/80">Super Author</span>
              </div>
              <Heart className="text-white/80" />
            </div>

            <div className="flex items-center gap-x-20">
              <span className="text-white/80">Super Album</span>
              <span className="text-white/80">12 001 146</span>
              <span className="text-white/80">2:23</span>
              <Play className="text-white/80" />
            </div>
          </div>
          <div className="flex justify-between items-center px-4 py-2 hover:bg-dark-background-secondary rounded-lg">
            <div className="flex gap-x-4 items-center">
              <span className="text-white/80">05</span>
              <Image
                src="https://i.imgur.com/Wp4hnLH.jpeg"
                width={64}
                height={64}
                className="rounded-md"
              />
              <div className="flex flex-col justify-center">
                <span>Super Song</span>
                <span className="text-sm text-white/80">Super Author</span>
              </div>
              <Heart className="text-white/80" />
            </div>

            <div className="flex items-center gap-x-20">
              <span className="text-white/80">Super Album</span>
              <span className="text-white/80">12 001 146</span>
              <span className="text-white/80">2:23</span>
              <Play className="text-white/80" />
            </div>
          </div>
          <div className="flex justify-between items-center px-4 py-2 hover:bg-dark-background-secondary rounded-lg">
            <div className="flex gap-x-4 items-center">
              <span className="text-white/80">05</span>
              <Image
                src="https://i.imgur.com/Wp4hnLH.jpeg"
                width={64}
                height={64}
                className="rounded-md"
              />
              <div className="flex flex-col justify-center">
                <span>Super Song</span>
                <span className="text-sm text-white/80">Super Author</span>
              </div>
              <Heart className="text-white/80" />
            </div>

            <div className="flex items-center gap-x-20">
              <span className="text-white/80">Super Album</span>
              <span className="text-white/80">12 001 146</span>
              <span className="text-white/80">2:23</span>
              <Play className="text-white/80" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2 justify-between ">
          <h2 className="text-lg font-medium">Recent Favorites</h2>
          <span className="uppercase text-base text-brand-blue hover:underline cursor-pointer">
            view all
          </span>
        </div>

        <div className="flex items-center gap-x-4 ">
          {data.tracks.slice(0, 5).map((track) => (
            <div key={track.track.ida} className="flex flex-col gap-y-2 max-w-[128px] relative">
              <div className="flex group">
                <Image
                  src={track.track.album.images[1].url}
                  width={128}
                  height={128}
                  className="rounded-md cursor-pointer"
                />

                <div className="rounded-md w-32 h-32 justify-center items-center absolute hidden group-hover:flex bg-black/25">
                  <Play size={48} weight="fill" />
                </div>
              </div>

              <label className="text-lg font-normal truncate hover:text-clip">
                {track.track.name}
              </label>
              <div>
                {track.track.artists.map((artist) => (
                  <span key={artist.id} className="text-sm font-normal">
                    {artist.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

Home.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;