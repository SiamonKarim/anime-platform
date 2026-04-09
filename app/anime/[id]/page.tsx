import { fetchTrendingAnime, fetchPopularAnime, fetchUpcomingAnime, fetchFavoriteAnime } from "@/lib/api";
import Link from "next/link";
import ContinueWatching from "@/components/ContinueWatching";

const AnimeRow = ({ title, animeList }: { title: string, animeList: any[] }) => {
  if (!animeList || animeList.length === 0) return null;
  return (
    <section className="mt-8 md:mt-12">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-[#ff4d4d] rounded-full"></span>
        {title}
      </h2>
      <div className="flex gap-4 md:gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory no-scrollbar">
        {animeList.map((anime: any) => (
          <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group flex-none w-[140px] md:w-[180px] lg:w-[200px] snap-start flex flex-col gap-3">
            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-[#18181b] shadow-lg border border-white/5">
              <img src={anime.images?.jpg?.large_image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <i className="fas fa-play-circle text-5xl text-[#ff4d4d]"></i>
              </div>
            </div>
            <h3 className="text-gray-300 font-medium text-sm truncate group-hover:text-[#ff4d4d]">{anime.title_english || anime.title}</h3>
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
    <main className="min-h-screen bg-[#09090b] pb-20">
      {heroAnime && (
        <section className="relative w-full h-[70vh] md:h-[85vh] flex items-center">
          <div className="absolute inset-0">
            <img src={heroAnime.images?.jpg?.large_image_url} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                {heroAnime.title_english || heroAnime.title}
              </h1>
              <Link href={`/anime/${heroAnime.mal_id}`} className="px-10 py-4 bg-[#ff4d4d] text-white font-bold rounded-full hover:scale-105 transition-all inline-flex items-center gap-2">
                <i className="fas fa-play"></i> Watch Now
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="relative z-20 -mt-10 max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-10">
        <div className="flex-grow flex flex-col gap-2">
          <ContinueWatching />
          <AnimeRow title="Trending Now" animeList={trending.slice(1)} />
          <AnimeRow title="Most Popular" animeList={popular} />
          <AnimeRow title="Top Favorites" animeList={favorites} />
          <AnimeRow title="Coming Soon" animeList={upcoming} />
        </div>

        <aside className="w-full lg:w-80 flex-none">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">TOP 10</h2>
            <div className="space-y-6">
              {trending.slice(0, 10).map((anime: any, index: number) => (
                <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} className="flex gap-4 group">
                  <span className={`text-2xl font-black italic ${index < 3 ? 'text-[#ff4d4d]' : 'text-gray-700'}`}>{index + 1}</span>
                  <div className="w-14 h-20 bg-white/5 rounded-lg overflow-hidden flex-none">
                    <img src={anime.images?.jpg?.large_image_url} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-[#ff4d4d]">{anime.title_english || anime.title}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">★ {anime.score || "N/A"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}