import Image from 'next/image';
import Link from 'next/link';
import { DotsThreeVertical, Heart, Play } from 'phosphor-react';
import { useState } from 'react';
import { useLoved } from '../../../lib/spotify';
import { normalizeAgo, setTimeDuration } from '../../../utils';

interface IList {
  token: string;
  track: any;
  fields: {
    cover: boolean;
    name: { title: boolean; artist: boolean };
    album: boolean;
    date: boolean;
    info: { loved: boolean; length: boolean };
  };
  addedAt?: string;
  count?: number;
}

const List = ({ track, count, fields, addedAt, token }: IList) => {
  const [loved, setLoved] = useState(track.loved);

  return (
    <li
      className="h-16 grid gap-x-4 justify-between items-center px-4 hover:bg-dark-background-secondary rounded-lg group cursor-pointer"
      style={{
        gridTemplateColumns: `1rem 50% repeat(auto-fit, minmax(2rem, 2fr))`,
      }}
    >
      <div className="flex items-center w-4 justify-center text-center">
        <span className="text-white/80 group-hover:hidden">{count}</span>
        <Play className="text-white/80 hidden group-hover:block" weight="fill" />
      </div>

      <div className="flex gap-x-4 items-center overflow-clip">
        {fields.cover && (
          <Image
            src={track.album?.images[2].url}
            layout="fixed"
            width={48}
            height={48}
            className="rounded-md min-w-[48px]"
          />
        )}
        <div className="flex flex-col justify-center">
          {fields.name.title && (
            <Link href={`/track/${track.id}`}>
              <a className="hover:underline truncate">{track.name}</a>
            </Link>
          )}

          {fields.name.artist && (
            <div className="flex gap-x-1 truncate">
              {track.artists.map((artist) => (
                <Link key={artist.id} href={`/artist/${artist.id}`}>
                  <a
                    className={`hover:underline text-sm text-white/80 after:content-[','] last:after:content-none`}
                  >
                    {artist.name}
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {fields.album && (
        <Link href={`/album/${track.album.id}`}>
          <a className="text-white/80 truncate hover:underline">{track.album.name}</a>
        </Link>
      )}

      {fields.date && <span className="text-white/80 truncate">{normalizeAgo(addedAt)}</span>}

      <div className="flex items-center gap-x-4 justify-end">
        {fields.info.loved && (
          <Heart
            onClick={() => {
              setLoved((prev) => !prev);
              useLoved(token, 'tracks', track.id, loved);
            }}
            className="text-white/80 mr-4"
            weight={loved ? 'fill' : 'regular'}
          />
        )}
        {fields.info.length && (
          <span className="text-white/80 ">{setTimeDuration(track.duration_ms)}</span>
        )}
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
