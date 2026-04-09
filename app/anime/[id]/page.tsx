import AnimePlayer from "@/components/AnimePlayer";
import { fetchAnimeById, fetchAnimeEpisodes } from "@/lib/api";
import Link from "next/link";

export default async function AnimeDetailsPage({ 
  params, 
  searchParams 
}: { 
  params: { id: string },
  searchParams: { ep?: string } 
}) {
  const [anime, episodes] = await Promise.all([
    fetchAnimeById(params.id),
    fetchAnimeEpisodes(params.id)
  ]);

  if (!anime) return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">404 NOT FOUND</div>;

  const currentEpNumber = searchParams.ep ? parseInt(searchParams.ep) : 1;
  const currentEpData = episodes.find((e: any) => e.mal_id === currentEpNumber) || episodes[0];
  const animeName = anime.title_english || anime.title;

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col">
      <nav className="p-6 border-b border-[#222]">
        <Link href="/" className="text-2xl uppercase font-black hover:text-[#ff2e00] transition" style={{ fontFamily: "'Anton', sans-serif" }}>
          <i className="fas fa-arrow-left mr-2"></i> BACK TO BASE
        </Link>
      </nav>

      <section className="w-full max-w-6xl mx-auto p-6 mt-6">
        <div className="w-full mb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-5xl uppercase text-white leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>{animeName}</h1>
            <p className="text-[#ff2e00] font-mono mt-2 text-sm uppercase">EPISODE {currentEpNumber} // {currentEpData?.title || "START"}</p>
          </div>
        </div>

        {/* The Smart Player now handles the video hunting internally */}
        <AnimePlayer 
          posterUrl={anime.images.jpg.large_image_url}
          animeId={params.id}
          animeTitle={animeName}
          episodeNumber={currentEpNumber}
        />
      </section>

      <section className="w-full max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-[#222] pt-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl text-white uppercase mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>SELECT EPISODE //</h2>
          {episodes.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {episodes.map((ep: any) => {
                const isActive = ep.mal_id === currentEpNumber;
                return (
                  <Link 
                    key={ep.mal_id} 
                    href={`/anime/${anime.mal_id}?ep=${ep.mal_id}`}
                    className={`aspect-square flex items-center justify-center font-mono text-lg font-bold border transition ${isActive ? "bg-[#ff2e00] border-[#ff2e00] text-black" : "bg-[#111] border-[#333] text-gray-400 hover:border-[#ff2e00] hover:text-white"}`}
                  >
                    {ep.mal_id}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-6 bg-[#111] border border-[#333] text-gray-500 font-mono text-sm">NO EPISODE DATA.</div>
          )}
        </div>

        <div className="md:col-span-1">
          <h2 className="text-2xl text-white uppercase mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>SYNOPSIS //</h2>
          <p className="text-gray-400 text-sm">{anime.synopsis ? `${anime.synopsis.substring(0, 300)}...` : "No data."}</p>
        </div>
      </section>
    </main>
  );
}