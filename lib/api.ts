const JIKAN_URL = 'https://api.jikan.moe/v4';
// Use your Render URL here (Must end with /)
const CORS_PROXY = 'https://cors-qpo5.onrender.com/'; 
const STREAM_API = 'https://api.amvstr.me/api/v2/stream';

// 1. HOME PAGE DATA FETCHERS
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

// 2. SEARCH & WATCH PAGE FETCHERS
export const fetchAnimeById = async (id: string) => {
  try {
    const res = await fetch(`${JIKAN_URL}/anime/${id}/full`);
    const data = await res.json();
    return data.data;
  } catch (err) { return null; }
};

export const searchAnime = async (query: string) => {
  try {
    const res = await fetch(`${JIKAN_URL}/anime?q=${query}&limit=20`);
    const data = await res.json();
    return data.data || [];
  } catch (err) { return []; }
};

// 3. AUTOMATION & VIDEO ENGINE (FIXED TYPES)
export const fetchVideoStream = async (animeTitle: string, ep: number) => {
  try {
    const slug = animeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const res = await fetch(`${CORS_PROXY}${STREAM_API}/${slug}-episode-${ep}`);
    
    if (!res.ok) return [];
    const data = await res.json();

    // EXPLICIT TYPE: Tell TypeScript what is in the array
    const sources: { name: string; url: string }[] = [];
    
    if (data.data?.stream?.multi) {
      Object.keys(data.data.stream.multi).forEach((serverName) => {
        sources.push({ 
          name: serverName.toUpperCase(), 
          url: `${CORS_PROXY}${data.data.stream.multi[serverName]}` 
        });
      });
    }
    
    return sources;
  } catch (err) { 
    return []; 
  }
};

export const calculateEpisodes = (anime: any) => {
  if (anime?.episodes) return anime.episodes;
  const name = anime?.title_english || anime?.title || "";
  if (name.includes("One Piece")) return 1100;
  return 12;
};