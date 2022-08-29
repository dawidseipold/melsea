// Components
import Slider from '../../utils/Slider/Slider';

// Icons
import {
  Heart,
  Repeat,
  SkipBack,
  Play,
  SkipForward,
  Shuffle,
  Playlist,
  SpeakerHigh,
} from 'phosphor-react';
import { useEffect, useInsertionEffect, useState } from 'react';
import Image from 'next/image';
import { getCurrentlyPlayingTrack, getRecentlyPlayedTracks } from '../../../lib/spotify';
import { useToken } from '../../../layouts/MainLayout';

// IKONY DO WYMIANY SA CHUJOWE

const Player = () => {
  const token = useToken((state) => state.token);

  const loved = true;

  return (
    <div className="bg-dark-background-secondary sticky bottom-0 w-full mx-auto flex justify-center items-center px-4 h-24 overflow-clip">
      {/* <div className="absolute left-0 right-0 w-full -top-0.5 h-1 bg-brand-blue flex flex-col gap-y-2">
        <div className="absolute w-3 h-3 rounded-full bg-white right-0 top-1/2 -translate-y-1/2" />
      </div>

      <div aria-label="song-info" className="flex items-center gap-x-4 flex-grow basis-0">
        <Image
          src="https://i.imgur.com/Wp4hnLH.jpeg"
          width={48}
          height={48}
          className="cover-sm bg-black"
        />

        <div>
          <h2 className="text-white">Whatever It Takes</h2>
          <span className="text-white/60">Imagine Dragons</span>
        </div>

        <Heart size={24} weight={loved ? 'fill' : 'regular'} className="text-brand-blue ml-2" />
      </div>

      <div
        aria-label="song-controls"
        className="flex flex-col items-center justify-between gap-y-4"
      >
        <div className="flex items-center gap-x-12">
          <Repeat size={24} className="text-white/50 cursor-pointer hover:text-white/80" />
          <SkipBack
            size={24}
            weight="fill"
            className="text-white hover:text-white/80 cursor-pointer"
          />

          <div className="p-3 bg-white rounded-full hover:bg-white/80 cursor-pointer">
            <Play size={24} weight="fill" className="text-dark-background-secondary" />
          </div>

          <SkipForward
            size={24}
            weight="fill"
            className="text-white hover:text-white/80 cursor-pointer"
          />
          <Shuffle size={24} className="text-white/50 cursor-pointer hover:text-white/80" />
        </div>
      </div>

      <div className="flex-grow basis-0">
        <div className="ml-auto w-fit flex items-center gap-x-8">
          <div className="flex justify-between gap-x-1">
            <span className="dark:text-white/75">1:20</span>
            <span className="dark:text-white/75">/</span>
            <span className="dark:text-white/75">3:40</span>
          </div>

          <div className="flex items-center gap-x-2">
            <SpeakerHigh size={20} className="text-white/90" />
            <div className="relative h-1 w-24 bg-white/90 rounded-full" />
          </div>
        </div>
      </div> */}
      WORK IN PROGRESS
    </div>
  );
};

export default Player;
