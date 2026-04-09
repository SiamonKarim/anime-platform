import { fetchTrendingAnime, fetchPopularAnime, fetchUpcomingAnime, fetchFavoriteAnime } from "@/lib/api";
import Link from "next/link";
import ContinueWatching from "@/components/ContinueWatching";

const AnimeRow = ({ title, animeList }: { title: string, animeList: any[] }) => {
  if (!animeList || animeList.length === 0) return null;
  return (
    <section className="mt-8 md:mt-12">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-[#ff4d4d] rounded-full shadow-[0_0_10px_rgba(255,77,77,0.8)]"></span>
        {title}
      </h2>
      <div className="flex gap-4 md:gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory no-scrollbar">
        {animeList.map((anime: any) => (
          <Link 
            href={`/anime/${anime.mal_id}`} 
            key={anime.mal_id} 
            className="group flex-none w-[140px] md:w-[180px] lg:w-[200px] snap-start flex flex-col gap-3 relative"
          >
            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-[#18181b] shadow-lg border border-white/5">
              <img 
                src={anime.images?.jpg?.large_image_url} 
                alt={anime.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40" 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <i className="fas fa-play-circle text-5xl text-[#ff4d4d] drop-shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300"></i>
              </div>
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <span className="bg-[#ff4d4d] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-md tracking-wider">HD</span>
                {anime.episodes && (
                  <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md border border-white/10">
                    EP {anime.episodes}
                  </span>
                )}
              </div>
            </div>
            <h3 className="text-gray-300 font-medium text-sm truncate group-hover:text-[#ff4d4d] transition-colors">
              {anime.title_english || anime.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default async function Home() {
  const [trending, popular, upcoming, favorites] = await Promise.all([
    fetchTrendingAnime(),
    fetchPopularAnime(),
    fetchUpcomingAnime(),
    fetchFavoriteAnime()
  ]);

  const heroAnime = trending[0];

  return (
    <main className="min-h-screen bg-[#09090b] pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      {heroAnime && (
        <section className="relative w-full h-[70vh] md:h-[85vh] flex items-center">
          <div className="absolute inset-0 w-full h-full">
            <img src={heroAnime.images?.jpg?.large_image_url} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent w-full md:w-3/4"></div>
          </div>
          <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 w-full pt-20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-[#ff4d4d] text-white text-xs font-black rounded tracking-widest uppercase shadow-[0_0_10px_rgba(255,77,77,0.5)]">Spotlight</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
                {heroAnime.title_english || heroAnime.title}
              </h1>
              <p className="text-gray-300 text-sm md:text-base mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed max-w-xl">
                {heroAnime.synopsis}
              </p>
              <Link href={`/anime/${heroAnime.mal_id}`} className="px-8 py-4 bg-[#ff4d4d] text-white font-bold rounded-full hover:scale-105 hover:shadow-[0_0_25px_rgba(255,77,77,0.6)] transition-all duration-300 inline-flex items-center gap-2">
                <i className="fas fa-play"></i> Watch Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. MAIN CONTENT AREA (GRID) */}
      <div className="relative z-20 -mt-10 md:-mt-16 max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT: CONTENT ROWS */}
          <div className="flex-grow flex flex-col gap-4">
            <ContinueWatching />
            <AnimeRow title="Trending This Week" animeList={trending.slice(1)} />
            <AnimeRow title="All-Time Popular" animeList={popular} />
            <AnimeRow title="Fan Favorites" animeList={favorites} />
            <AnimeRow title="Coming Soon" animeList={upcoming} />
          </div>

          {/* RIGHT: TOP 10 SIDEBAR */}
          <aside className="w-full lg:w-80 flex-none">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <i className="fas fa-chart-line text-[#ff4d4d]"></i> TOP 10
              </h2>
              <div className="space-y-6">
                {trending.slice(0, 10).map((anime: any, index: number) => (
                  <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} className="flex gap-4 group">
                    <span className={`text-2xl font-black italic ${index < 3 ? 'text-[#ff4d4d]' : 'text-gray-700'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="w-14 h-20 bg-white/5 rounded-lg overflow-hidden flex-none">
                      <img src={anime.images.jpg.large_image_url} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" alt="" />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="text-sm font-bold text-gray-200 line-clamp-1 group-hover:text-[#ff4d4d] transition-colors">
                        {anime.title_english || anime.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                        <i className="fas fa-star text-yellow-500 mr-1"></i> {anime.score || "N/A"} • {anime.type}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-400 transition-all uppercase tracking-widest border border-white/5">
                View Full List
              </button>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}