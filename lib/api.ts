const JIKAN_URL = 'https://api.jikan.moe/v4';

const OFFLINE_ANIME = {
  mal_id: 9999,
  title: "System Offline",
  title_english: "System Offline",
  status: "Completed",
  episodes: 12,
  score: 9.8,
  synopsis: "The public API server is currently rate-limiting us. This is a secure offline fallback.",
  images: { jpg: { large_image_url: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-PEn1CTc93DQl.jpg" } }
};

// HELPER FUNCTION: Safely fetch data or return fallback array
const safeFetch = async (endpoint: string, limit = 15) => {
  try {
    const res = await fetch(`${JIKAN_URL}${endpoint}&limit=${limit}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("API Blocked");
    const data = await res.json();
    return data.data || [OFFLINE_ANIME];
  } catch (error) {
    return Array(limit).fill(OFFLINE_ANIME).map((a, i) => ({ ...a, mal_id: i + 1000 })); 
  }
};

// FETCH MULTIPLE CATEGORIES
export const fetchTrendingAnime = () => safeFetch('/top/anime?filter=airing');
export const fetchPopularAnime = () => safeFetch('/top/anime?filter=bypopularity');
export const fetchUpcomingAnime = () => safeFetch('/seasons/upcoming?');
export const fetchFavoriteAnime = () => safeFetch('/top/anime?filter=favorite');

// DETAILS & EPISODES (Bulletproof)
export const fetchAnimeById = async (id: string) => {
  try {
    const res = await fetch(`${JIKAN_URL}/anime/${id}/full`);
    if (!res.ok) throw new Error("API Blocked");
    const data = await res.json();
    return data.data || OFFLINE_ANIME;
  } catch (error) { return { ...OFFLINE_ANIME, mal_id: id }; }
};

export const fetchAnimeEpisodes = async (id: string) => {
  try {
    const res = await fetch(`${JIKAN_URL}/anime/${id}/episodes`);
    if (!res.ok) throw new Error("API Blocked");
    const data = await res.json();
    return data.data?.length ? data.data : Array.from({ length: 12 }, (_, i) => ({ mal_id: i + 1, title: `Episode ${i + 1}` }));
  } catch (error) { 
    return Array.from({ length: 12 }, (_, i) => ({ mal_id: i + 1, title: `Offline Episode ${i + 1}` }));
  }
};