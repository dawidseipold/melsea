// Components
import Player from '../components/layout/Player/Player';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import Header from '../components/layout/Header/Header';
import { Controller } from 'react-hook-form';

// Hooks
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';

// Functions
import create from 'zustand';

// Types
import { Fragment, ReactNode } from 'react';
import { Dialog, RadioGroup, Tab } from '@headlessui/react';
import { classNames } from '../utils';
import { X } from 'phosphor-react';
import { createPlaylist } from '../lib/spotify';
import { useRouter } from 'next/router';
import { getPlaybackState } from '../lib/spotify/player';

interface IMainLayout {
  children: ReactNode;
}

export const usePlaylistModalStore = create((set) => ({
  open: false,
  setOpen: () => set(() => ({ open: true })),
  setClosed: () => set(() => ({ open: false })),
}));

export const useToken = create((set) => ({
  token: '',
  setToken: (value: string) => set(() => ({ token: value })),
}));

const MainLayout = ({ children }: IMainLayout) => {
  const router = useRouter();
  const { data, status } = useSession();
  const token = useToken((state) => state.token);
  const playlistModal = usePlaylistModalStore();

  const {
    register,
    handleSubmit,
    control,
    reset,

    formState: { errors },
  } = useForm();

  const onSubmit = async (body: { name: string; description?: string; privacy?: string }) => {
    if (body.privacy === 'private') {
      Object.assign(body, { ...body, public: false });
    }

    if (body.privacy === 'collaborative') {
      Object.assign(body, { ...body, public: false, collaborative: true });
    }

    if (body.privacy === 'public') {
      Object.assign(body, { ...body, public: true });
    }

    delete body.privacy;

    await createPlaylist(token, body);

    reset();
    playlistModal.setClosed();
    router.replace(router.asPath);
  };

  if (status === 'loading') {
    return <div></div>;
  }

  return (
    <>
      <div className="h-screen flex flex-col justify-between">
        <div className="flex h-[calc(100vh-6rem)]">
          <Sidebar />

          <div className="relative w-full overflow-y-scroll overflow-x-clip">
            <Header user={data.session.user} />
            {children}
          </div>
        </div>

        <Player />
      </div>

      {/* Dynamic Content */}
      <Dialog as="div" open={playlistModal.open} onClose={playlistModal.setClosed}>
        <div className="fixed inset-0 z-40 bg-dark-background-primary/75" aria-hidden="true" />

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Panel className="relative mx-auto min-w-[512px] max-w-sm rounded-2xl overflow-hidden bg-dark-background-secondary ">
            <button
              onClick={playlistModal.setClosed}
              type="reset"
              className="absolute right-0 top-0 cursor-pointer flex bg-dark-background-elevation items-center justify-center p-2 rounded-bl-2xl rounded-tr-2xl hover:bg-red-500/50"
            >
              <X size={20} />
            </button>

            <Tab.Group>
              <Tab.List className="flex text-center pt-8 px-8">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      `flex-1 py-2 rounded-lg ${
                        selected && 'border-b border-blue-500 bg-dark-background-elevation'
                      } hover:bg-dark-background-elevation`
                    )
                  }
                >
                  Normal
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      `flex-1 pb-2 disabled:text-gray-500 ${
                        selected && 'border-b border-blue-500 bg-dark-background-elevation'
                      }`
                    )
                  }
                  disabled
                >
                  Dynamic
                </Tab>
              </Tab.List>

              <Tab.Panels>
                <Tab.Panel>
                  <form
                    onSubmit={handleSubmit((body) => {
                      onSubmit(body);
                      console.log('closing');
                      console.log(playlistModal.open);

                      playlistModal.setClosed;
                      console.log('should close');
                      console.log(playlistModal.open);
                    })}
                    className="flex flex-col gap-y-4 p-8"
                  >
                    <div className="flex flex-col gap-y-2">
                      <label className="text-sm font-normal tracking-wide" htmlFor="name">
                        Name
                      </label>
                      <input
                        className={`flex px-4 py-2 rounded-lg ring-default bg-dark-background-elevation ${
                          errors.name && 'ring-error'
                        }`}
                        type="text"
                        maxLength={100}
                        {...register('name', { required: true, maxLength: 100 })}
                      />
                      {errors.name && (
                        <span className="text-red-500 font-light text-xs">
                          This field is required
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-y-2">
                      <label className="text-sm font-normal tracking-wide" htmlFor="description">
                        Description (optional)
                      </label>
                      <textarea
                        rows={8}
                        maxLength={300}
                        className="flex resize-none px-4 py-2 rounded-lg ring-default bg-dark-background-elevation"
                        {...register('description', { maxLength: 300 })}
                      />
                    </div>

                    <Controller
                      name="privacy"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange, value, ref } }) => (
                        <RadioGroup
                          value={value}
                          onChange={onChange}
                          defaultChecked={true}
                          defaultValue={value}
                          className="flex flex-col gap-y-2"
                        >
                          <RadioGroup.Label className="text-sm font-normal tracking-wide">
                            Privacy
                          </RadioGroup.Label>
                          <div
                            className={`w-full flex text-center bg-dark-background-elevation p-2 rounded-lg gap-x-2 ring-default ${
                              errors.privacy && 'ring-error'
                            }`}
                          >
                            <RadioGroup.Option value="private" as={Fragment}>
                              {({ checked }) => (
                                <div
                                  className={`flex-1 p-2 rounded cursor-pointer ${
                                    checked
                                      ? 'bg-dark-background-secondary'
                                      : 'hover:bg-dark-background-secondary/50'
                                  }`}
                                >
                                  Private
                                </div>
                              )}
                            </RadioGroup.Option>
                            <RadioGroup.Option value="collaborative" as={Fragment}>
                              {({ checked }) => {
                                return (
                                  <div
                                    className={`flex-1 p-2 rounded cursor-pointer
                ${
                  checked ? 'bg-dark-background-secondary' : 'hover:bg-dark-background-secondary/50'
                }`}
                                  >
                                    Collaborative
                                  </div>
                                );
                              }}
                            </RadioGroup.Option>
                            <RadioGroup.Option value="public" as={Fragment}>
                              {({ checked }) => (
                                <div
                                  className={`flex-1 p-2 rounded cursor-pointer ${
                                    checked
                                      ? 'bg-dark-background-secondary'
                                      : 'hover:bg-dark-background-secondary/50'
                                  }`}
                                >
                                  Public
                                </div>
                              )}
                            </RadioGroup.Option>
                          </div>

                          {errors.privacy && (
                            <span className="text-red-500 font-light text-xs">
                              This field is required
                            </span>
                          )}
                        </RadioGroup>
                      )}
                    />

                    <input
                      type="submit"
                      className="mt-4 cursor-pointer flex gap-x-2 bg-dark-background-elevation w-full items-center justify-center py-4 rounded-full hover:bg-white/5"
                    />
                  </form>
                </Tab.Panel>
                <Tab.Panel>Nothing...</Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default MainLayout;
