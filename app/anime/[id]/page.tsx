import AnimePlayer from "@/components/AnimePlayer";
import { fetchAnimeById, fetchAnimeEpisodes } from "@/lib/api";
import Link from "next/link";

// 1. Next.js 15 Strict Types: URLs are now Promises
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function WatchPage(props: Props) {
  // 2. We MUST await the URL parameters before using them
  const params = await props.params;
  const searchParams = await props.searchParams;

  // 3. Now we safely fetch the database using the awaited ID
  const anime = await fetchAnimeById(params.id);
  const episodes = await fetchAnimeEpisodes(params.id, anime.episodes);

  // 4. Safely parse the episode number
  const epQuery = searchParams.ep;
  const epNumber = epQuery ? parseInt(epQuery as string) : 1;
  const animeName = anime.title_english || anime.title;

  return (
    <main className="min-h-screen bg-[#09090b] text-gray-200 pb-20">
      
      {/* Immersive Background Blur */}
      <div className="fixed inset-0 w-full h-[60vh] opacity-20 z-0 pointer-events-none">
        <img src={anime.images?.jpg?.large_image_url} className="w-full h-full object-cover blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#09090b]"></div>
      </div>

      {/* The Theater */}
      <section className="relative z-10 w-full px-4 md:px-8 max-w-[1600px] mx-auto pt-8">
        <AnimePlayer 
          posterUrl={anime.images?.jpg?.large_image_url}
          animeId={params.id}
          animeTitle={animeName}
          episodeNumber={epNumber}
        />
        
        <div className="max-w-5xl mx-auto mt-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">{animeName}</h1>
            <div className="flex items-center gap-3 text-sm font-semibold mb-6">
              <span className="text-yellow-400"><i className="fas fa-star"></i> {anime.score || "N/A"}</span>
              <span className="bg-white/10 px-2 py-1 rounded text-gray-300">{anime.status || "Unknown"}</span>
              <span className="bg-[#ff4d4d]/20 text-[#ff4d4d] px-2 py-1 rounded border border-[#ff4d4d]/30">HD</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">{anime.synopsis}</p>
          </div>
        </div>
      </section>

      {/* Scrollable Episode Selector */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 mt-12">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-list text-[#ff4d4d]"></i> Episodes ({episodes.length})
        </h3>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#ff4d4d] scrollbar-track-white/5">
          {episodes.map((ep: any) => {
            const isActive = ep.mal_id === epNumber;
            return (
              <Link 
                key={ep.mal_id} 
                href={`/anime/${anime.mal_id}?ep=${ep.mal_id}`}
                className={`py-3 rounded-lg text-center font-bold text-sm transition-all duration-300 ${
                  isActive 
                    ? "bg-[#ff4d4d] text-white shadow-[0_0_15px_rgba(255,77,77,0.4)] scale-105" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {ep.mal_id}
              </Link>
            );
          })}
        </div>
      </section>

    </main>
  );
}