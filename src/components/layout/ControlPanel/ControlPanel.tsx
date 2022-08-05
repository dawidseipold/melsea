// Components
import Slider from '../../utility/Slider/Slider';

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
import { useState } from 'react';
import Image from 'next/image';

// IKONY DO WYMIANY SA CHUJOWE

const ControlPanel = () => {
  const loved = true;
  const [values, setValues] = useState(0);

  return (
    <div className="bg-dark-background-secondary sticky bottom-0 w-full mx-auto flex justify-between items-center px-4 py-6 overflow-clip">
      <div className="absolute left-0 right-0 w-full -top-0.5 h-1 bg-brand-blue flex flex-col gap-y-2">
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
          <Repeat size={24} className="text-white/50" />
          <SkipBack size={24} weight="fill" className="text-white" />
          <Play size={48} weight="fill" className="p-3 bg-white rounded-full text-black" />
          <SkipForward size={24} weight="fill" className="text-white" />
          <Shuffle size={24} className="text-white/50" />
        </div>
        {/* <div className="flex gap-x-4 items-center justify-center">

        </div> */}
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
      </div>
    </div>

    // <div>s</div>
  );
};

export default ControlPanel;
