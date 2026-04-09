import { fetchTrendingAnime } from "@/lib/api";
import Link from "next/link";
import ContinueWatching from "@/components/ContinueWatching";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default async function Home() {
  const trendingAnime = await fetchTrendingAnime();
  const topAnime = trendingAnime[0];

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-12">
      
      {/* ANIWATCH STYLE NAVBAR - GLASSMORPHISM */}
      <nav className="flex justify-between items-center px-6 py-4 fixed w-full top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black text-white tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>
            PROJECT<span className="text-[#ff2e00]">X</span>
          </Link>
          <div className="hidden md:flex gap-6 font-medium text-sm text-gray-300">
            <Link href="/" className="hover:text-[#ff2e00] transition-colors">Home</Link>
            <Link href="#" className="hover:text-[#ff2e00] transition-colors">Movies</Link>
            <Link href="#" className="hover:text-[#ff2e00] transition-colors">TV Series</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-5 py-2 bg-[#ff2e00] text-white font-bold text-sm rounded-full hover:scale-105 transition shadow-[0_0_15px_rgba(255,46,0,0.4)]">
                Login
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </nav>

      {/* ANIWATCH STYLE HERO SECTION */}
      {topAnime && (
        <section className="relative w-full h-[65vh] md:h-[80vh] flex items-center pt-16">
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img src={topAnime.images.jpg.large_image_url} alt="Hero" className="w-full h-full object-cover opacity-50 blur-sm md:blur-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent w-full md:w-3/4"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg" style={{ fontFamily: "'Anton', sans-serif" }}>
                {topAnime.title_english || topAnime.title}
              </h1>
              <div className="flex items-center gap-4 text-xs font-semibold mb-6">
                <span className="flex items-center gap-1 text-yellow-400"><i className="fas fa-star"></i> {topAnime.score || "N/A"}</span>
                <span className="bg-[#ff2e00] px-2 py-1 rounded text-white font-bold">HD</span>
              </div>
              <p className="text-gray-300 text-sm md:text-base mb-8 line-clamp-3">
                {topAnime.synopsis || "Engaging emergency protocols. Data classified."}
              </p>
              <div className="flex gap-4">
                <Link href={`/anime/${topAnime.mal_id}`} className="px-8 py-3 bg-[#ff2e00] text-white font-bold rounded-full hover:scale-105 transition shadow-[0_0_20px_rgba(255,46,0,0.5)] flex items-center gap-2">
                  <i className="fas fa-play-circle text-lg"></i> Watch Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MEMORY ENGINE */}
      <div className="max-w-7xl mx-auto w-full mt-[-2rem] relative z-20 px-6">
        <ContinueWatching />
      </div>

      {/* ANIWATCH STYLE GRID */}
      <section className="px-6 max-w-7xl mx-auto w-full mt-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: "'Anton', sans-serif" }}>
          <span className="w-1 h-6 bg-[#ff2e00] rounded-full"></span>
          TRENDING DATABASE
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {trendingAnime.map((anime: any) => (
            <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group flex flex-col gap-2">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#111]">
                <img 
                  src={anime.images.jpg.large_image_url} 
                  alt={anime.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <i className="fas fa-play text-4xl text-[#ff2e00] drop-shadow-lg"></i>
                </div>
              </div>
              <h3 className="text-gray-200 font-medium text-sm line-clamp-2 group-hover:text-[#ff2e00] transition">
                {anime.title_english || anime.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}