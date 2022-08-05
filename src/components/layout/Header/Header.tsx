// Components
import Image from 'next/image';
import { Menu } from '@headlessui/react';

// Functions
import { signOut } from 'next-auth/react';

// Icons
import {
  Bell,
  CaretDown,
  Command,
  Fire,
  Gear,
  House,
  MagnifyingGlass,
  SignOut,
} from 'phosphor-react';
import { DefaultUser, User } from 'next-auth';

interface IHeader {
  user?: User;
}

const Header = ({ user }: IHeader) => {
  return (
    <header className="py-4 px-8 sticky top-0 z-20 flex items-center justify-start bg-dark-background-primary gap-x-6">
      <div className="flex items-center px-4 py-2 w-64 justify-between bg-dark-background-elevation hover:bg-white/10 rounded-full">
        <span className="dark:text-white/60 text-sm font-light">
          Artists, songs, or podcasts...
        </span>

        <MagnifyingGlass size={20} className="dark:text-white/60" />
      </div>

      <div className="ml-auto relative group">
        <Bell
          size={22}
          weight="bold"
          className="cursor-pointer text-white/60 group-hover:text-white"
        />

        <div className="h-2 w-2 rounded-full bg-red-500 absolute top-0 right-0.5 outline outline-2 outline-dark-background-primary" />
      </div>

      <Menu as="div" className="relative flex">
        {({ open }) => (
          <>
            <Menu.Button>
              <div
                className={`flex items-center gap-x-2 bg-dark-background-elevation  p-1 pr-2 cursor-pointer rounded-full hover:bg-white/10`}
              >
                <Image
                  src={user?.image as string}
                  objectFit="cover"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="font-medium spacing tracking-wide text-sm">{user?.name}</span>
                <CaretDown size={16} weight="bold" className="text-white/60" />
              </div>
            </Menu.Button>

            <Menu.Items className="absolute overflow-hidden right-0 top-[calc(100%+0.5rem)] flex flex-col gap-y-2 rounded-lg py-2  bg-dark-background-elevation w-56 min-w-full">
              <div className="px-2">
                <Menu.Item
                  as="div"
                  className="cursor-pointer flex items-center justify-between p-1 hover:bg-white/10 rounded"
                >
                  <div className="flex items-center gap-x-2">
                    <Gear size={20} />
                    <span>Settings</span>
                  </div>

                  <div className="flex gap-x-1 bg-dark-background-secondary px-2 items-center rounded">
                    <Command size={20} /> <span>+</span> <span>I</span>
                  </div>
                </Menu.Item>
              </div>

              <div className="border-t border-white/10 px-2 pt-2">
                <Menu.Item
                  as="div"
                  onClick={() => signOut()}
                  className="cursor-pointer flex items-center justify-between p-1 hover:bg-red-600/10 rounded"
                >
                  <div className="flex items-center gap-x-2">
                    <SignOut size={20} weight="fill" />
                    <span>Log Out</span>
                  </div>

                  <div className="flex gap-x-1 bg-dark-background-secondary px-2 items-center rounded">
                    <Command size={20} /> <span>+</span> <span>P</span>
                  </div>
                </Menu.Item>
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>
    </header>
  );
};

export default Header;
