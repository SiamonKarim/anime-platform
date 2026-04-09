import AnimePlayer from "@/components/AnimePlayer";
import EpisodeSelector from "@/components/EpisodeSelector";
import { fetchAnimeById, fetchVideoStream, calculateEpisodes } from "@/lib/api";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function WatchPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const anime = await fetchAnimeById(params.id);
  
  if (!anime) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Database Connection Error</h2>
        <Link href="/" className="text-[#ff4d4d] hover:underline">Back to Browse</Link>
      </div>
    );
  }

  const epQuery = searchParams.ep;
  const currentEpNumber = epQuery ? parseInt(epQuery as string) : 1;
  const animeName = anime.title_english || anime.title;
  
  // FETCH THE REAL STREAM
  const liveVideoUrl = await fetchVideoStream(animeName, currentEpNumber);
  const totalEpisodesCount = calculateEpisodes(anime);

  return (
    <main className="min-h-screen bg-[#09090b] text-gray-200 pb-20">
      <div className="fixed inset-0 w-full h-[60vh] opacity-20 z-0 pointer-events-none">
        <img src={anime.images?.jpg?.large_image_url} className="w-full h-full object-cover blur-3xl" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#09090b]"></div>
      </div>

      <section className="relative z-10 w-full px-4 md:px-8 max-w-[1600px] mx-auto pt-24">
        <AnimePlayer 
          posterUrl={anime.images?.jpg?.large_image_url}
          animeId={params.id}
          animeTitle={animeName}
          episodeNumber={currentEpNumber}
          videoUrl={liveVideoUrl} 
        />
        
        <div className="max-w-5xl mx-auto mt-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{animeName}</h1>
          <div className="flex items-center gap-3 text-sm font-semibold mb-6">
            <span className="text-yellow-400">★ {anime.score || "N/A"}</span>
            <span className="bg-[#ff4d4d]/20 text-[#ff4d4d] px-2 py-1 rounded border border-[#ff4d4d]/30">HD</span>
          </div>
          <p className="text-gray-400 leading-relaxed max-w-3xl">{anime.synopsis}</p>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 mt-12 border-t border-white/5 pt-8">
        <h3 className="text-xl font-bold text-white mb-6">Episodes ({totalEpisodesCount})</h3>
        <EpisodeSelector totalEpisodes={totalEpisodesCount} currentEpisode={currentEpNumber} animeId={params.id} />
      </section>
    </main>
  );
}