const JIKAN_URL = 'https://api.jikan.moe/v4';

const safeFetch = async (endpoint: string, limit = 24) => {
  try {
    // We use Next.js revalidation to automatically update the site data every hour
    const res = await fetch(`${JIKAN_URL}${endpoint}&limit=${limit}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("API Blocked");
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    return []; 
  }
};

// AUTOMATED CATEGORIES
export const fetchTrendingAnime = () => safeFetch('/top/anime?filter=airing');
export const fetchPopularAnime = () => safeFetch('/top/anime?filter=bypopularity');
export const fetchFavoriteAnime = () => safeFetch('/top/anime?filter=favorite');
// The "Coming Soon" Section
export const fetchUpcomingAnime = () => safeFetch('/seasons/upcoming?');

// REAL ANIME DATA EXTRACTION
export const fetchAnimeById = async (id: string) => {
  try {
    const res = await fetch(`${JIKAN_URL}/anime/${id}/full`);
    if (!res.ok) throw new Error("API Blocked");
    const data = await res.json();
    return data.data || null;
  } catch (error) { return null; }
};

// UNIVERSAL EPISODE CALCULATOR
export const calculateEpisodes = (anime: any) => {
  // 1. If the database knows the exact total (e.g., completed shows), use it.
  if (anime.episodes) return anime.episodes;
  
  // 2. If it is currently airing, MyAnimeList might say "null". 
  // We check if it's a known long-running show.
  const name = anime.title_english || anime.title || "";
  if (name.includes("One Piece")) return 1100; // Safe minimum for One Piece
  if (name.includes("Detective Conan")) return 1120;
  
  // 3. Default ongoing season fallback
  return 12;
};