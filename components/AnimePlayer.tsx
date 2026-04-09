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
  // We start with a universally unblockable Google MP4 video as the absolute fallback
  const fallbackVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const [streamUrl, setStreamUrl] = useState(fallbackVideo);
  const [status, setStatus] = useState("HUNTING FOR STREAM...");

  useEffect(() => {
    // Save Watch History
    const historyData = {
      id: animeId,
      title: animeTitle,
      episode: episodeNumber,
      image: posterUrl,
      url: `/anime/${animeId}?ep=${episodeNumber}`
    };
    localStorage.setItem('projectX_history', JSON.stringify(historyData));

    // Try to hunt for the real Anime stream
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
            setStatus("STREAM API EMPTY. PLAYING FALLBACK.");
          }
        } else {
          setStatus("API SERVERS DOWN. PLAYING FALLBACK.");
        }
      } catch (error) {
        setStatus("SCRAPER BLOCKED BY CORS. PLAYING FALLBACK.");
      }
    };

    fetchRealVideo();
  }, [animeId, animeTitle, episodeNumber, posterUrl]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,46,0,0.15)] border border-white/10 relative">
        <MediaPlayer 
          title={`Episode ${episodeNumber}`} 
          src={streamUrl} 
          playsInline
          className="w-full h-full absolute top-0 left-0"
        >
          <MediaProvider>
            {posterUrl && <Poster className="vds-poster object-cover opacity-60" src={posterUrl} alt="Cover" />}
          </MediaProvider>
          <DefaultVideoLayout icons={defaultLayoutIcons} color="#ff2e00" />
        </MediaPlayer>
      </div>
      <div className="text-xs font-bold text-[#ff2e00] text-right tracking-wider uppercase">
        {status}
      </div>
    </div>
  );
}