import { fetchTrendingAnime } from "@/lib/api";
import Link from "next/link";
import ContinueWatching from "@/components/ContinueWatching";

export default async function Home() {
  const trendingAnime = await fetchTrendingAnime();
  const topAnime = trendingAnime[0];

  return (
    <main className="min-h-screen flex flex-col bg-[#050505]">
      
      {/* NAVIGATION */}
      <nav className="flex justify-between items-center p-6 border-b border-[#222] bg-black/90 sticky top-0 z-50">
        <div className="text-3xl uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
          PROJECT<span className="text-[#ff2e00]">X</span>
        </div>
        
        <form action="/search" method="GET" className="hidden md:flex flex-1 max-w-md mx-8">
          <input type="text" name="q" placeholder="SEARCH DATABASE..." className="w-full bg-[#111] border border-[#333] text-white px-4 py-1 font-mono text-sm focus:border-[#ff2e00] outline-none transition" />
          <button type="submit" className="bg-[#333] text-white px-4 hover:bg-[#ff2e00] hover:text-black transition"><i className="fas fa-search"></i></button>
        </form>

        <div className="flex gap-8 text-sm text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <Link href="/" className="hover:text-[#ff2e00] transition">HOME</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center p-6 md:p-12 w-full max-w-6xl mx-auto border-b border-[#222]">
        <div className="w-full mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl uppercase text-white leading-none tracking-wide" style={{ fontFamily: "'Anton', sans-serif" }}>
              {topAnime ? (topAnime.title_english || topAnime.title) : "SYSTEM STANDBY"}
            </h1>
            <p className="text-[#ff2e00] mt-2 text-sm uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {topAnime ? `TOP TRENDING // SCORE: ${topAnime.score}` : "ESTABLISHING CONNECTION..."}
            </p>
          </div>
          {topAnime && (
            <Link href={`/anime/${topAnime.mal_id}`} className="px-6 py-2 bg-[#ff2e00] text-black font-bold uppercase text-sm hover:bg-white transition" style={{ fontFamily: "'Anton', sans-serif" }}>
              WATCH NOW <i className="fas fa-play ml-2"></i>
            </Link>
          )}
        </div>
      </section>

      {/* INJECTING THE MEMORY ENGINE */}
      <ContinueWatching />

      {/* MASSIVE TRENDING GRID */}
      <section className="p-6 md:px-12 pb-12 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl text-white uppercase mb-6 tracking-wide mt-6" style={{ fontFamily: "'Anton', sans-serif" }}>GLOBAL DATABASE //</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {trendingAnime.map((anime: any) => (
            <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group cursor-pointer block">
              <div className="relative aspect-[3/4] overflow-hidden border border-[#333] group-hover:border-[#ff2e00] transition duration-300">
                <img 
                  src={anime.images.jpg.large_image_url} 
                  alt={anime.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 left-2 bg-[#ff2e00] text-black text-xs font-bold px-2 py-1 uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {anime.score ? `★ ${anime.score}` : "HD"}
                </div>
              </div>
              <h3 className="text-white mt-3 font-bold truncate text-sm">{anime.title_english || anime.title}</h3>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}