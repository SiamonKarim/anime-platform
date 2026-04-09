import { fetchTrendingAnime, fetchPopularAnime, fetchUpcomingAnime } from "@/lib/api";
import Link from "next/link";
import ContinueWatching from "@/components/ContinueWatching";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

// REUSABLE PREMIUM ROW COMPONENT
const AnimeRow = ({ title, animeList }: { title: string, animeList: any[] }) => (
  <section className="mt-8 md:mt-12 max-w-[1600px] mx-auto px-4 md:px-8">
    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
      <span className="w-1.5 h-6 bg-brand rounded-full shadow-[0_0_10px_rgba(255,77,77,0.8)]"></span>
      {title}
    </h2>
    
    <div className="flex gap-4 md:gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory no-scrollbar">
      {animeList.map((anime: any) => (
        <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group flex-none w-[140px] md:w-[180px] lg:w-[200px] snap-start flex flex-col gap-3 relative">
          
          {/* Constrained Poster Container */}
          <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface shadow-lg border border-white/5">
            <img 
              src={anime.images?.jpg?.large_image_url || ""} 
              alt={anime.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40" 
            />
            
            {/* Hover Play Button overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <i className="fas fa-play-circle text-5xl text-brand drop-shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300"></i>
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <span className="bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded shadow-md tracking-wider">HD</span>
              {anime.episodes && (
                <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md border border-white/10">
                  EP {anime.episodes}
                </span>
              )}
            </div>
            {anime.score && (
              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md border border-white/10 flex items-center gap-1">
                <i className="fas fa-star text-yellow-400"></i> {anime.score}
              </div>
            )}
          </div>

          {/* Clean Title */}
          <h3 className="text-gray-300 font-medium text-sm truncate group-hover:text-brand transition-colors">
            {anime.title_english || anime.title}
          </h3>
        </Link>
      ))}
    </div>
  </section>
);

export default async function Home() {
  const [trending, popular, upcoming] = await Promise.all([
    fetchTrendingAnime(),
    fetchPopularAnime(),
    fetchUpcomingAnime()
  ]);

  const heroAnime = trending[0];

  return (
    <main className="min-h-screen bg-dark pb-20 overflow-x-hidden">
      
      {/* Sleek Glass Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-white tracking-tighter flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-brand rounded flex items-center justify-center text-white text-sm shadow-[0_0_15px_rgba(255,77,77,0.5)]">
              <i className="fas fa-play ml-0.5"></i>
            </div>
            PROJ<span className="text-brand">X</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-6 py-2 bg-white text-black font-bold text-sm rounded-full hover:bg-brand hover:text-white transition-all duration-300 shadow-lg">
                  Login
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </nav>

      {/* Cinematic Hero */}
      {heroAnime && (
        <section className="relative w-full h-[70vh] md:h-[85vh] flex items-center">
          <div className="absolute inset-0 w-full h-full">
            <img src={heroAnime.images?.jpg?.large_image_url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent w-full md:w-3/4"></div>
          </div>

          <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 w-full pt-20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-brand text-white text-xs font-black rounded tracking-widest uppercase shadow-[0_0_10px_rgba(255,77,77,0.5)]">Spotlight</span>
                <span className="text-gray-300 text-sm font-semibold tracking-wider"><i className="fas fa-star text-yellow-400"></i> {heroAnime.score}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
                {heroAnime.title_english || heroAnime.title}
              </h1>
              
              <p className="text-gray-300 text-sm md:text-base mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed max-w-xl">
                {heroAnime.synopsis}
              </p>
              
              <div className="flex gap-4">
                <Link href={`/anime/${heroAnime.mal_id}`} className="px-8 py-4 bg-brand text-white font-bold rounded-full hover:scale-105 hover:shadow-[0_0_25px_rgba(255,77,77,0.6)] transition-all duration-300 inline-flex items-center gap-2">
                  <i className="fas fa-play"></i> Watch Now
                </Link>
                <Link href={`/anime/${heroAnime.mal_id}`} className="px-8 py-4 bg-surface/80 backdrop-blur-md text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2 border border-white/10">
                  Details <i className="fas fa-chevron-right text-xs"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Database Ecosystem */}
      <div className="relative z-20 -mt-10 md:-mt-16">
        <ContinueWatching />
        <AnimeRow title="Trending This Week" animeList={trending.slice(1)} />
        <AnimeRow title="All-Time Popular" animeList={popular} />
        <AnimeRow title="Upcoming Next Season" animeList={upcoming} />
      </div>

    </main>
  );
}