const JIKAN_URL = 'https://api.jikan.moe/v4';
// Use your Render URL here - make sure it ends with /
const CORS_PROXY = 'https://cors-qpo5.onrender.com/'; 
const VIDEO_API = 'https://api.consumet.org/anime/gogoanime/watch';

export const fetchTrendingAnime = async () => {
  try {
    const res = await fetch(`${JIKAN_URL}/top/anime?filter=airing&limit=20`);
    const data = await res.json();
    return data.data || [];
  } catch (err) { return []; }
};

export const fetchPopularAnime = async () => {
  try {
    const res = await fetch(`${JIKAN_URL}/top/anime?filter=bypopularity&limit=20`);
    const data = await res.json();
    return data.data || [];
  } catch (err) { return []; }
};

export const fetchUpcomingAnime = async () => {
  try {
    const res = await fetch(`${JIKAN_URL}/seasons/upcoming?limit=20`);
    const data = await res.json();
    return data.data || [];
  } catch (err) { return []; }
};

export const fetchFavoriteAnime = async () => {
  try {
    const res = await fetch(`${JIKAN_URL}/top/anime?filter=favorite&limit=20`);
    const data = await res.json();
    return data.data || [];
  } catch (err) { return []; }
};

export const fetchAnimeById = async (id: string) => {
  try {
    const res = await fetch(`${JIKAN_URL}/anime/${id}/full`);
    const data = await res.json();
    return data.data;
  } catch (err) { return null; }
};

// HELPER: CALCULATE REAL EPISODE COUNTS
export const calculateEpisodes = (anime: any) => {
  if (anime?.episodes) return anime.episodes;
  const name = anime?.title_english || anime?.title || "";
  if (name.includes("One Piece")) return 1100;
  if (name.includes("Detective Conan")) return 1120;
  return 12;
};

// AUTOMATION: FETCH REAL VIDEO THROUGH YOUR PROXY
export const fetchVideoStream = async (animeTitle: string, ep: number) => {
  try {
    const cleanId = animeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const res = await fetch(`${CORS_PROXY}${VIDEO_API}/${cleanId}-episode-${ep}`);
    const data = await res.json();
    
    const rawUrl = data.sources?.find((s: any) => s.quality === '1080p')?.url || data.sources?.[0]?.url;
    
    return rawUrl ? `${CORS_PROXY}${rawUrl}` : null;
  } catch (err) {
    console.error("Video Fetch Error:", err);
    return null;
  }
};