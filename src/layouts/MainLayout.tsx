// Components
import ControlPanel from '../components/layout/ControlPanel/ControlPanel';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import Header from '../components/layout/Header/Header';

// Hooks
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

// Functions
import { signIn } from 'next-auth/react';

// Types
import { ReactNode, useEffect, useLayoutEffect } from 'react';
import { DefaultProfile, DefaultUser, EventCallbacks, Session } from 'next-auth';

interface IMainLayout {
  children: ReactNode;
}

const MainLayout = ({ children }: IMainLayout) => {
  const { data, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.replace('/login');
  //   }
  // }, []);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col justify-between">
      {/* <div className="flex h-[calc(100vh-6rem)]">
        <Sidebar />

        <div className="w-full overflow-y-scroll overflow-x-clip">
          <Header user={data.session.user} />
          <div className="p-8">{children}</div>
        </div>
      </div>

      <ControlPanel /> */}

      <div>test</div>
    </div>
  );
};

export default MainLayout;
