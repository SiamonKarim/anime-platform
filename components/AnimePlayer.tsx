"use client";

import { useState, useEffect } from 'react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

export default function AnimePlayer({ posterUrl, animeTitle, episodeNumber, sources }: any) {
  // Default to the first server (usually 'main')
  const [activeSource, setActiveSource] = useState(sources?.[0]?.url || "");

  useEffect(() => {
    if (sources?.length > 0) setActiveSource(sources[0].url);
  }, [sources]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative">
        <MediaPlayer 
          title={`${animeTitle} - EP ${episodeNumber}`} 
          src={activeSource} 
          playsInline
          className="w-full h-full"
        >
          <MediaProvider>
            {posterUrl && <Poster className="vds-poster object-cover opacity-60" src={posterUrl} alt="Cover" />}
          </MediaProvider>
          <DefaultVideoLayout icons={defaultLayoutIcons} color="#ff4d4d" />
        </MediaPlayer>
      </div>

      {/* SERVER SWITCHER UI */}
      <div className="flex flex-wrap gap-3 items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Switch Server:</span>
        {sources?.map((source: any, index: number) => (
          <button
            key={index}
            onClick={() => setActiveSource(source.url)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeSource === source.url 
                ? "bg-[#ff4d4d] text-white shadow-[0_0_10px_rgba(255,77,77,0.5)]" 
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {source.name}
          </button>
        ))}
        {(!sources || sources.length === 0) && <span className="text-xs text-red-500">No servers found for this episode.</span>}
      </div>
    </div>
  );
}