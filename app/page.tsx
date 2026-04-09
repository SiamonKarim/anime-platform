import { fetchTrendingAnime, fetchPopularAnime, fetchUpcomingAnime, fetchFavoriteAnime } from "@/lib/api";
import Link from "next/link";
import ContinueWatching from "@/components/ContinueWatching";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

// Reusable Component for the Horizontal Scrolling Rows
const AnimeRow = ({ title, animeList }: { title: string, animeList: any[] }) => (
  <section className="mt-10 max-w-[1400px] mx-auto px-4 md:px-8">
    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight flex items-center gap-2">
      <span className="w-1 h-5 md:h-6 bg-[#ff4d4d] rounded-full"></span>
      {title}
    </h2>
    {/* Hide scrollbar but allow horizontal scroll */}
    <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
      {animeList.map((anime: any) => (
        <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group flex-none w-36 md:w-44 lg:w-48 snap-start flex flex-col gap-2">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#18181b] shadow-lg border border-white/5">
            <img 
              src={anime.images.jpg.large_image_url} 
              alt={anime.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:opacity-40" 
            />
            {/* Minimalist Hover State */}
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <i className="fas fa-play text-3xl text-white drop-shadow-[0_0_10px_rgba(255,77,77,0.8)] mb-2 scale-75 group-hover:scale-100 transition-transform"></i>
              <div className="flex gap-2 text-[10px] font-bold text-white">
                <span className="bg-[#ff4d4d] px-1.5 py-0.5 rounded shadow">HD</span>
                <span className="bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1"><i className="fas fa-star text-yellow-400"></i> {anime.score || "N/A"}</span>
              </div>
            </div>
            {/* Episode Badge */}
            <div className="absolute top-2 left-2 flex gap-1 group-hover:opacity-0 transition-opacity">
              {anime.episodes && (
                <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm border border-white/10">
                  EP {anime.episodes}
                </span>
              )}
            </div>
          </div>
          <h3 className="text-gray-200 font-medium text-sm line-clamp-2 leading-snug group-hover:text-[#ff4d4d] transition-colors">
            {anime.title_english || anime.title}
          </h3>
        </Link>
      ))}
    </div>
  </section>
);

export default async function Home() {
  // Fetch all categories simultaneously for maximum speed
  const [trending, popular, upcoming, favorites] = await Promise.all([
    fetchTrendingAnime(),
    fetchPopularAnime(),
    fetchUpcomingAnime(),
    fetchFavoriteAnime()
  ]);

  const heroAnime = trending[0];

  return (
    <main className="min-h-screen bg-[#09090b] pb-20 overflow-x-hidden">
      
      {/* Premium Glass Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ff4d4d] rounded-lg flex items-center justify-center text-black text-sm">
              <i className="fas fa-play"></i>
            </div>
            PROJ<span className="text-[#ff4d4d]">X</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-5 py-2 bg-white/10 text-white font-bold text-sm rounded-full hover:bg-[#ff4d4d] hover:text-white transition-all duration-300">
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

      {/* Cinematic Hero Wrapper */}
      {heroAnime && (
        <section className="relative w-full h-[65vh] md:h-[80vh] flex items-center pt-20">
          <div className="absolute inset-0 w-full h-full">
            <img src={heroAnime.images.jpg.large_image_url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent w-full md:w-2/3"></div>
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 w-full">
            <div className="max-w-xl">
              <span className="text-[#ff4d4d] font-bold tracking-wider text-xs md:text-sm mb-3 block drop-shadow-md">★ #1 TRENDING TODAY</span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-[1.1] tracking-tight drop-shadow-2xl">
                {heroAnime.title_english || heroAnime.title}
              </h1>
              <div className="flex items-center gap-3 text-xs md:text-sm font-semibold mb-6 text-gray-300">
                <span className="text-white bg-white/10 px-2 py-1 rounded">{heroAnime.type || "TV"}</span>
                <span>•</span>
                <span>{heroAnime.episodes ? `${heroAnime.episodes} Episodes` : "Airing"}</span>
                <span>•</span>
                <span className="text-yellow-400"><i className="fas fa-star"></i> {heroAnime.score}</span>
              </div>
              <p className="text-gray-300 text-sm md:text-base mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed max-w-lg">
                {heroAnime.synopsis}
              </p>
              <Link href={`/anime/${heroAnime.mal_id}`} className="px-8 py-3.5 bg-[#ff4d4d] text-white font-bold rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(255,77,77,0.4)] transition-all duration-300 inline-flex items-center gap-2">
                <i className="fas fa-play"></i> Watch Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* The Dynamic Content Ecosystem */}
      <div className="relative z-20 -mt-12 md:-mt-20">
        <ContinueWatching />
        
        {/* Our New Horizontal Rows */}
        <AnimeRow title="Trending This Week" animeList={trending.slice(1)} />
        <AnimeRow title="Most Popular of All Time" animeList={popular} />
        <AnimeRow title="Fan Favorites" animeList={favorites} />
        <AnimeRow title="Upcoming Next Season" animeList={upcoming} />
      </div>

    </main>
  );
}