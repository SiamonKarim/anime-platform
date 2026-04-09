"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ContinueWatching() {
  const [history, setHistory] = useState<any>(null);

  // When the component loads in the browser, check the local memory
  useEffect(() => {
    const saved = localStorage.getItem('projectX_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // If there's no memory (first time user), don't show the banner at all
  if (!history) return null; 

  return (
    <section className="p-6 md:px-12 pt-8 w-full max-w-7xl mx-auto">
      <h2 className="text-xl text-[#ff2e00] uppercase mb-4 tracking-wide" style={{ fontFamily: "'Anton', sans-serif" }}>
        CONTINUE WATCHING //
      </h2>
      
      <Link href={history.url} className="group flex items-center gap-6 bg-[#111] border border-[#333] hover:border-[#ff2e00] p-4 transition duration-300">
        {history.image && (
          <img src={history.image} alt={history.title} className="w-24 h-32 object-cover border border-[#222]" />
        )}
        <div>
          <h3 className="text-2xl md:text-3xl text-white uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
            {history.title}
          </h3>
          <p className="text-gray-400 font-mono text-sm mt-2 uppercase">
            EPISODE {history.episode}
          </p>
          <div className="mt-4 px-4 py-2 bg-[#ff2e00] text-black text-xs font-bold uppercase inline-block font-mono group-hover:bg-white transition">
            RESUME PLAYBACK <i className="fas fa-play ml-1"></i>
          </div>
        </div>
      </Link>
    </section>
  );
}