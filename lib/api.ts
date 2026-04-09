const JIKAN_URL = 'https://api.jikan.moe/v4';
// YOUR PRIVATE PROXY
const CORS_PROXY = 'https://cors-qpo5.onrender.com/'; 
// STABLE STREAMING API
const STREAM_API = 'https://api.amvstr.me/api/v2/stream';

export const fetchTrendingAnime = async () => {
  const res = await fetch(`${JIKAN_URL}/top/anime?filter=airing&limit=20`);
  const data = await res.json();
  return data.data || [];
};

export const fetchPopularAnime = async () => {
  const res = await fetch(`${JIKAN_URL}/top/anime?filter=bypopularity&limit=20`);
  const data = await res.json();
  return data.data || [];
};

export const fetchUpcomingAnime = async () => {
  const res = await fetch(`${JIKAN_URL}/seasons/upcoming?limit=20`);
  const data = await res.json();
  return data.data || [];
};

export const fetchFavoriteAnime = async () => {
  const res = await fetch(`${JIKAN_URL}/top/anime?filter=favorite&limit=20`);
  const data = await res.json();
  return data.data || [];
};

export const fetchAnimeById = async (id: string) => {
  const res = await fetch(`${JIKAN_URL}/anime/${id}/full`);
  const data = await res.json();
  return data.data;
};

export const calculateEpisodes = (anime: any) => {
  if (anime?.episodes) return anime.episodes;
  const name = anime?.title_english || anime?.title || "";
  if (name.includes("One Piece")) return 1100;
  return 12;
};

// --- THE NEW AMVSTR STREAMER ---
export const fetchVideoStream = async (animeTitle: string, ep: number) => {
  try {
    // 1. Clean the title for the URL (e.g. "One Piece" -> "one-piece")
    const slug = animeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // 2. Ping the stable Amvstr API through your proxy
    const res = await fetch(`${CORS_PROXY}${STREAM_API}/${slug}-episode-${ep}`);
    
    if (!res.ok) return null;
    const data = await res.json();

    // 3. Extract the master HLS (.m3u8) link
    const rawUrl = data.data?.stream?.multi?.main || data.data?.stream?.file;
    
    return rawUrl ? `${CORS_PROXY}${rawUrl}` : null;
  } catch (err) {
    return null;
  }
};