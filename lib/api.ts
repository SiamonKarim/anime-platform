const JIKAN_URL = 'https://api.jikan.moe/v4';

const OFFLINE_ANIME = {
  mal_id: 9999, title: "System Offline", title_english: "System Offline", status: "Completed", episodes: 12, score: 9.8, synopsis: "API rate limit reached.", images: { jpg: { large_image_url: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-PEn1CTc93DQl.jpg" } }
};

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

export const fetchTrendingAnime = () => safeFetch('/top/anime?filter=airing');
export const fetchPopularAnime = () => safeFetch('/top/anime?filter=bypopularity');
export const fetchUpcomingAnime = () => safeFetch('/seasons/upcoming?');
export const fetchFavoriteAnime = () => safeFetch('/top/anime?filter=favorite');

export const fetchAnimeById = async (id: string) => {
  try {
    const res = await fetch(`${JIKAN_URL}/anime/${id}/full`);
    if (!res.ok) throw new Error("API Blocked");
    const data = await res.json();
    return data.data || OFFLINE_ANIME;
  } catch (error) { return { ...OFFLINE_ANIME, mal_id: id }; }
};

// DYNAMIC EPISODE GENERATOR
export const fetchAnimeEpisodes = async (id: string, totalEpisodesFromDetails: number | null) => {
  try {
    // We fetch the first page of episodes from the API for titles
    const res = await fetch(`${JIKAN_URL}/anime/${id}/episodes`);
    const data = await res.json();
    
    // If the API returns detailed episodes, use them. 
    // Otherwise, mathematically generate the exact number of episodes based on the show's total length (e.g. 1000+ for One Piece)
    if (data.data && data.data.length > 0) {
      return data.data;
    } else {
      const count = totalEpisodesFromDetails || 12; // Fallback to 12 if still airing and unknown
      return Array.from({ length: count }, (_, i) => ({ mal_id: i + 1, title: `Episode ${i + 1}` }));
    }
  } catch (error) { 
    const count = totalEpisodesFromDetails || 12;
    return Array.from({ length: count }, (_, i) => ({ mal_id: i + 1, title: `Episode ${i + 1}` }));
  }
};