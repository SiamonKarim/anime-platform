"use client";

import { useState } from "react";
import Link from "next/link";

export default function EpisodeSelector({ totalEpisodes, currentEpisode, animeId }: { totalEpisodes: number, currentEpisode: number, animeId: string }) {
  // Figure out which chunk the user is currently watching (e.g., Episode 150 means Chunk 2)
  const initialChunk = Math.floor((currentEpisode - 1) / 100) || 0;
  const [chunkIndex, setChunkIndex] = useState(initialChunk);

  const chunkSize = 100;
  const totalChunks = Math.ceil(totalEpisodes / chunkSize);

  // Generate the specific episodes for the selected chunk
  const startEp = chunkIndex * chunkSize + 1;
  const endEp = Math.min((chunkIndex + 1) * chunkSize, totalEpisodes);
  const visibleEpisodes = Array.from({ length: endEp - startEp + 1 }, (_, i) => startEp + i);

  return (
    <div className="w-full">
      {/* The Chunk Dropdown */}
      {totalChunks > 1 && (
        <div className="mb-6 flex items-center gap-4">
          <label className="text-gray-400 font-semibold text-sm">Select Range:</label>
          <select 
            value={chunkIndex}
            onChange={(e) => setChunkIndex(Number(e.target.value))}
            className="bg-[#18181b] border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#ff4d4d] transition-colors cursor-pointer font-medium"
          >
            {Array.from({ length: totalChunks }, (_, i) => {
              const start = i * chunkSize + 1;
              const end = Math.min((i + 1) * chunkSize, totalEpisodes);
              return (
                <option key={i} value={i}>
                  Episodes {start} - {end}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* The Episode Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#ff4d4d] scrollbar-track-white/5">
        {visibleEpisodes.map((ep) => {
          const isActive = ep === currentEpisode;
          return (
            <Link 
              key={ep} 
              href={`/anime/${animeId}?ep=${ep}`}
              className={`py-3 rounded-lg text-center font-bold text-sm transition-all duration-300 ${
                isActive 
                  ? "bg-[#ff4d4d] text-white shadow-[0_0_15px_rgba(255,77,77,0.4)] scale-105" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {ep}
            </Link>
          );
        })}
      </div>
    </div>
  );
}