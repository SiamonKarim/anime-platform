"use client";

import { useEffect } from 'react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

interface AnimePlayerProps {
  streamUrl: string;
  posterUrl?: string;
  animeId: string;
  animeTitle: string;
  episodeNumber: number;
}

export default function AnimePlayer({ streamUrl, posterUrl, animeId, animeTitle, episodeNumber }: AnimePlayerProps) {
  
  // THE MEMORY ENGINE: Saves history when the player loads
  useEffect(() => {
    const historyData = {
      id: animeId,
      title: animeTitle,
      episode: episodeNumber,
      image: posterUrl,
      url: `/anime/${animeId}?ep=${episodeNumber}`
    };
    // Save to browser memory
    localStorage.setItem('projectX_history', JSON.stringify(historyData));
  }, [animeId, animeTitle, episodeNumber, posterUrl]);

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-[#333] shadow-[0_0_40px_rgba(255,46,0,0.1)] relative">
      <MediaPlayer 
        title={`Episode ${episodeNumber}`} 
        src={streamUrl} 
        crossOrigin
        playsInline
        className="w-full h-full absolute top-0 left-0"
      >
        <MediaProvider>
          {posterUrl && <Poster className="vds-poster object-cover" src={posterUrl} alt="Cover" />}
        </MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons} color="#ff2e00" />
      </MediaPlayer>
    </div>
  );
}