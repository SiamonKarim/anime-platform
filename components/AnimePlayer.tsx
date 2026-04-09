"use client";

import { useEffect, useState } from 'react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

export default function AnimePlayer({ posterUrl, animeId, animeTitle, episodeNumber }: any) {
  // A completely unblockable, high-quality HLS test stream
  const RELIABLE_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  
  useEffect(() => {
    // Save history seamlessly
    localStorage.setItem('projectX_history', JSON.stringify({
      id: animeId,
      title: animeTitle,
      episode: episodeNumber,
      image: posterUrl,
      url: `/anime/${animeId}?ep=${episodeNumber}`
    }));
  }, [animeId, animeTitle, episodeNumber, posterUrl]);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 relative mt-8">
      <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#ff4d4d] tracking-widest uppercase border border-white/10">
        Playing Ep {episodeNumber}
      </div>
      <MediaPlayer 
        title={`Episode ${episodeNumber}`} 
        src={RELIABLE_STREAM} 
        playsInline
        className="w-full aspect-video"
      >
        <MediaProvider>
          {posterUrl && <Poster className="vds-poster object-cover opacity-80" src={posterUrl} alt="Cover" />}
        </MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons} color="#ff4d4d" />
      </MediaPlayer>
    </div>
  );
}