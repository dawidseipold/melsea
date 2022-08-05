// Components
import Link from 'next/link';

// Hooks
import { useRouter } from 'next/router';

// Icons
import { Compass, Fire, House, ListBullets, Microphone, MusicNotesPlus } from 'phosphor-react';

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    {
      index: 1,
      name: 'Home',
      icon: <House size={28} />,
      link: '/',
      active: function () {
        return this.link === router.route;
      },
    },
    {
      index: 2,
      name: 'Trending',
      icon: <Fire size={28} />,
      link: '/trending',
      active: function () {
        return this.link === router.route;
      },
    },
    {
      index: 3,
      name: 'Discover',
      icon: <Compass size={28} />,
      link: '/discover',
      active: function () {
        return this.link === router.route;
      },
    },
    {
      index: 4,
      name: 'Podcasts',
      icon: <Microphone size={28} />,
      link: '/podcasts',
      active: function () {
        return this.link === router.route;
      },
    },
    {
      index: 5,
      name: 'Playlists',
      icon: <ListBullets size={28} />,
      link: '/playlists',
      active: function () {
        return this.link === router.route;
      },
    },
  ];

  return (
    <div className="flex flex-col w-24 p-4 bg-dark-background-secondary items-center">
      <ul className="w-28 items-center flex flex-col gap-y-4">
        {menuItems.map((item) => (
          <Link key={item.index} href={item.link}>
            <li
              className={`hover:bg-white/10 p-4 rounded-md cursor-pointer ${
                item.active() ? 'text-blue-500' : 'text-white/60'
              }`}
            >
              {item.icon}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
