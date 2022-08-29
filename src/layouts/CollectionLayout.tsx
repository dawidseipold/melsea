// Components
import Link from 'next/link';
import { RadioGroup } from '@headlessui/react';

// Hooks
import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Functions
import create from 'zustand';

// Icons
import { Columns, Rows } from 'phosphor-react';

// Types
import type { ReactNode } from 'react';

interface ICollectionLayout {
  children: ReactNode;
}

// Banks

export const useMode = create((set) => ({
  mode: 'vertical',
  setMode: (value: string) => set(() => ({ mode: value })),
}));

const CollectionLayout = ({ children }: ICollectionLayout) => {
  const mode = useMode();
  const router = useRouter();

  const tabs = ['playlists', 'podcasts', 'artists', 'albums'];

  return (
    <div className="flex flex-col gap-y-4 p-8">
      <nav className="flex gap-x-2">
        {tabs.map((tab) => (
          <Link href={`/collection/${tab}`}>
            <a
              className={`p-4 capitalize hover:bg-dark-background-secondary rounded-lg ${
                router.asPath === `/collection/${tab}` && 'bg-dark-background-elevation'
              }`}
            >
              {tab}
            </a>
          </Link>
        ))}
      </nav>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide capitalize">
          {router.asPath.split('/').slice(-1)}
        </h1>

        <RadioGroup
          className="flex items-center bg-dark-background-secondary p-2 rounded-lg gap-x-2"
          value={mode.mode}
          onChange={mode.setMode}
        >
          <RadioGroup.Option value="horizontal">
            {({ checked }) => (
              <div className="p-1 hover:bg-dark-background-elevation rounded">
                <Rows
                  size={24}
                  className={`${checked ? 'text-blue-500' : 'text-white/60'} cursor-pointer`}
                />
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="vertical">
            {({ checked }) => (
              <div className="p-1 hover:bg-dark-background-elevation rounded">
                <Columns
                  size={24}
                  className={`${checked ? 'text-blue-500' : 'text-white/60'} cursor-pointer`}
                />
              </div>
            )}
          </RadioGroup.Option>
        </RadioGroup>
      </div>

      {children}
    </div>
  );
};

export default CollectionLayout;
