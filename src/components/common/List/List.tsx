import Image from 'next/image';
import Link from 'next/link';
import { DotsThreeVertical, Heart, Play } from 'phosphor-react';
import { useState } from 'react';
import { useLoved } from '../../../lib/spotify';
import { normalizeAgo, setTimeDuration } from '../../../utils';

const List = ({ item, count, token }) => {
  const [loved, setLoved] = useState(item.track.loved);

  return (
    <li
      className="grid gap-x-4 justify-between items-center px-4 py-2 hover:bg-dark-background-secondary rounded-lg group cursor-pointer"
      style={{
        gridTemplateColumns: '16px 50% 20fr 10fr auto',
      }}
    >
      <div className="flex items-center w-4 justify-center text-center">
        <span className="text-white/80 group-hover:hidden">{count}</span>
        <Play className="text-white/80 hidden group-hover:block" weight="fill" />
      </div>

      <div className="flex gap-x-4 items-center overflow-clip">
        <Image
          src={item.track.album?.images[2].url}
          layout="fixed"
          width={48}
          height={48}
          className="rounded-md min-w-[48px]"
        />
        <div className="flex flex-col justify-center">
          <Link href={`/track/${item.track.id}`}>
            <a className="hover:underline truncate">{item.track.name}</a>
          </Link>

          <div className="flex gap-x-1 truncate">
            {item.track.artists.map((artist) => (
              <Link key={artist.id} href={`/artist/${artist.id}`}>
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
        <a className="text-white/80 truncate hover:underline">{item.track.album.name}</a>
      </Link>

      <span className="text-white/80 truncate">{normalizeAgo(item.added_at)}</span>

      <div className="flex items-center gap-x-4">
        <Heart
          onClick={() => {
            setLoved((prev) => !prev);
            useLoved(item.track.id, token, loved);
          }}
          className="text-white/80 mr-4"
          weight={loved ? 'fill' : 'regular'}
        />
        <span className="text-white/80 ">{setTimeDuration(item.track.duration_ms)}</span>
        <div
          onClick={(e) => e.preventDefault()}
          className="hover:bg-white/10 p-1 rounded-full invisible group-hover:visible"
        >
          <DotsThreeVertical className="text-white/80 " />
        </div>
      </div>
    </li>
  );
};

export default List;
