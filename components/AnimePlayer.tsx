"use client";

import { useEffect, useState } from 'react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

interface AnimePlayerProps {
  posterUrl?: string;
  animeId: string;
  animeTitle: string;
  episodeNumber: number;
}

export default function AnimePlayer({ posterUrl, animeId, animeTitle, episodeNumber }: AnimePlayerProps) {
  // We start with the default video, then try to overwrite it with the real one
  const [streamUrl, setStreamUrl] = useState("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");
  const [status, setStatus] = useState("HUNTING FOR STREAM...");

  useEffect(() => {
    // 1. Save History
    const historyData = {
      id: animeId,
      title: animeTitle,
      episode: episodeNumber,
      image: posterUrl,
      url: `/anime/${animeId}?ep=${episodeNumber}`
    };
    localStorage.setItem('projectX_history', JSON.stringify(historyData));

    // 2. CLIENT-SIDE VIDEO HUNTER (Bypasses Vercel Server Blocks)
    const fetchRealVideo = async () => {
      try {
        const cleanTitle = animeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const res = await fetch(`https://api.amvstr.me/api/v2/stream/${cleanTitle}-episode-${episodeNumber}`);
        
        if (res.ok) {
          const data = await res.json();
          const realUrl = data.data?.stream?.multi?.main || data.data?.stream?.file;
          if (realUrl) {
            setStreamUrl(realUrl);
            setStatus("REAL STREAM ACQUIRED.");
          } else {
            setStatus("STREAM NOT FOUND. PLAYING FALLBACK.");
          }
        }
      } catch (error) {
        setStatus("SCRAPER BLOCKED BY CORS. PLAYING FALLBACK.");
      }
    };

    fetchRealVideo();
  }, [animeId, animeTitle, episodeNumber, posterUrl]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-[#333] shadow-[0_0_40px_rgba(255,46,0,0.1)] relative">
        {/* Removed crossOrigin attribute to fix the broken poster image issue */}
        <MediaPlayer 
          title={`Episode ${episodeNumber}`} 
          src={streamUrl} 
          playsInline
          className="w-full h-full absolute top-0 left-0"
        >
          <MediaProvider>
            {posterUrl && <Poster className="vds-poster object-cover opacity-50" src={posterUrl} alt="Cover" />}
          </MediaProvider>
          <DefaultVideoLayout icons={defaultLayoutIcons} color="#ff2e00" />
        </MediaPlayer>
      </div>
      <div className="text-xs font-mono text-[#ff2e00] text-right uppercase">
        {status}
      </div>
    </div>
  );
}