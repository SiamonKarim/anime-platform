import { searchAnime } from "@/lib/api";
import Link from "next/link";

const GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance", "Sci-Fi", "Slice of Life"];

export default async function SearchPage({ searchParams }: any) {
  const params = await searchParams;
  const query = params.q || "";
  const results = query ? await searchAnime(query) : [];

  return (
    <main className="min-h-screen bg-[#09090b] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-64 flex-none">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
            <h2 className="text-white font-bold mb-6 flex items-center gap-2">
              <i className="fas fa-filter text-[#ff4d4d]"></i> Filter
            </h2>
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">By Genre</p>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {GENRES.map(genre => (
                  <button key={genre} className="text-left text-sm text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-all">
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* RESULTS GRID */}
        <div className="flex-grow">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
              {query ? `RESULTS FOR: "${query.toUpperCase()}"` : "DISCOVER ALL ANIME"}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">{results.length} titles found in the database.</p>
          </header>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {results.map((anime: any) => (
                <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group flex flex-col gap-3">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 shadow-lg">
                    <img src={anime.images.jpg.large_image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-yellow-400 border border-white/10">
                      ★ {anime.score || "N/A"}
                    </div>
                    {/* Hover Play Button */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="fas fa-play text-white text-3xl"></i>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-200 line-clamp-2 leading-snug group-hover:text-[#ff4d4d] transition-colors">
                    {anime.title_english || anime.title}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <i className="fas fa-search-minus text-3xl text-gray-600"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
              <p className="text-gray-500 max-w-xs mx-auto text-sm">We couldn't find any anime matching that query. Try searching for something else!</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}