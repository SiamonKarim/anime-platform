import { fetchTrendingAnime } from "@/lib/api";
import Link from "next/link";
import ContinueWatching from "@/components/ContinueWatching";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default async function Home() {
  const trendingAnime = await fetchTrendingAnime();
  const heroAnime = trendingAnime[0];

  return (
    <main className="min-h-screen bg-[#09090b]">
      
      {/* Premium Glass Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-white tracking-tighter">
            PROJ<span className="text-[#ff4d4d]">X</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-5 py-2 bg-white text-black font-bold text-sm rounded-full hover:bg-[#ff4d4d] hover:text-white transition-colors duration-300">
                  Sign In
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </nav>

      {/* Cinematic Hero Slider */}
      {heroAnime && (
        <section className="relative w-full h-[75vh] flex items-center pt-20">
          <div className="absolute inset-0 w-full h-full">
            <img src={heroAnime.images.jpg.large_image_url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent w-full md:w-2/3"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-xl">
              <span className="text-[#ff4d4d] font-bold tracking-wider text-sm mb-2 block drop-shadow-md">#1 TRENDING TODAY</span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight tracking-tighter">
                {heroAnime.title_english || heroAnime.title}
              </h1>
              <p className="text-gray-300 text-base mb-8 line-clamp-3 leading-relaxed">
                {heroAnime.synopsis}
              </p>
              <Link href={`/anime/${heroAnime.mal_id}`} className="px-8 py-3.5 bg-white text-black font-bold rounded-full hover:bg-[#ff4d4d] hover:text-white transition-all duration-300 flex items-center gap-2 inline-flex">
                <i className="fas fa-play"></i> Start Watching
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-20 -mt-10 mb-12">
        <ContinueWatching />
      </div>

      {/* Premium Content Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold text-white mb-6">Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {trendingAnime.map((anime: any) => (
            <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group flex flex-col gap-3">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#18181b] shadow-lg">
                <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-60 transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 text-white">
                    <i className="fas fa-play ml-1"></i>
                  </div>
                </div>
              </div>
              <h3 className="text-gray-200 font-medium text-sm line-clamp-1 group-hover:text-white transition-colors">
                {anime.title_english || anime.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}