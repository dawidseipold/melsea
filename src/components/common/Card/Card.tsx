import { format, parse } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'phosphor-react';
import { forwardRef } from 'react';

interface ICard {
  data: object;
  prefix: 'track' | 'playlist' | 'artist' | 'album' | 'show';
  direction?: 'vertical' | 'horizontal';
  type?: 'person' | 'piece';
  dropdown?: JSX.Element;
}

const Card = ({ data, prefix, direction = 'vertical', type = 'piece', dropdown }: ICard) => {
  return (
    <Link href={`/${prefix}/${data.id}`}>
      <a className="flex-1">
        {dropdown}

        {direction === 'vertical' ? (
          <div className="p-4 max-w-[16rem] rounded-lg bg-dark-background-secondary hover:bg-dark-background-elevation flex flex-col gap-y-4 w-full">
            <div
              className="aspect-square h-full relative group"
              onClick={(e) => e.preventDefault()}
            >
              <Image
                src={data.images?.[0] ? data.images[0].url : '/background-1.jpg'}
                layout="fill"
                className={`${type === 'person' ? 'rounded-full' : 'rounded-md'} object-cover`}
              />

              <div
                className={`${
                  type === 'person' ? 'rounded-full' : 'rounded-md'
                } w-full h-full left-0 top-0 absolute hidden group-hover:flex justify-center items-center bg-dark-background-elevation/25`}
              >
                <Play size={48} weight="fill" />
              </div>
            </div>

            <div className="truncate">
              <span className="">{data.name}</span>

              <div className={`flex items-center`}>
                {data.type === 'playlist' && (
                  <Link href={`/user/${data.owner.id}`}>
                    <span className="hover:underline">{data.owner.display_name}</span>
                  </Link>
                )}

                {data.type === 'album' && (
                  <>
                    <span className="capitalize after:content-['\2022'] after:mx-2">
                      {data.album_type}
                    </span>

                    <span>{data.release_year}</span>
                  </>
                )}

                {data.type === 'playlist' && data.tracks.total > 0 && (
                  <span className="before:content-['\2022'] before:mx-2">{`${data.tracks.total} ${
                    data.tracks.total > 1 ? 'songs' : 'song'
                  }`}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-dark-background-secondary hover:bg-dark-background-elevation flex gap-x-4 w-full ">
            <div
              className="aspect-square h-max w-max relative flex group"
              onClick={(e) => e.preventDefault()}
            >
              <Image
                src={data.images?.[0] ? data.images[0].url : '/background-1.jpg'}
                layout="fixed"
                width={128}
                height={128}
                className={`${type === 'person' ? 'rounded-full' : 'rounded-md'} object-cover`}
              />

              <div
                className={`${
                  type === 'person' ? 'rounded-full' : 'rounded-md'
                } w-full h-full left-0 top-0 absolute hidden group-hover:flex justify-center items-center bg-dark-background-elevation/25`}
              >
                <Play size={48} weight="fill" />
              </div>
            </div>

            <div className="flex flex-col justify-start w-full overflow-hidden gap-y-1">
              <span className="truncate">{data.name}</span>

              {data.type === 'playlist' && data.owner.id !== 'spotify' && (
                <div className="line-clamp-3 text-white/60 text-sm">{data.description}</div>
              )}

              <div className="flex items-center mt-auto">
                <Link href={`/user/${data.owner.id}`}>
                  <span className="hover:underline">
                    {data.type === 'playlist' ? data.owner.display_name : 'cos innego'}
                  </span>
                </Link>

                {data.type === 'playlist' && data.tracks.total > 0 && (
                  <span className="before:content-['\2022'] before:mx-2">{`${data.tracks.total} ${
                    data.tracks.total > 1 ? 'songs' : 'song'
                  }`}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </a>
    </Link>
  );
};

export default Card;
