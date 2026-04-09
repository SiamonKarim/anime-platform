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
// --- THE SMART SEARCH-FIRST ENGINE ---
export const fetchVideoStream = async (animeTitle: string, ep: number) => {
  try {
    // 1. Clean the title for a broad search
    const searchTitle = animeTitle.split(':')[0].split('(')[0].trim();
    
    // 2. SEARCH the video provider first to get the REAL ID
    // We use Gogoanime as the provider via Consumet/Amvstr
    const searchUrl = `https://api.consumet.org/anime/gogoanime/${encodeURIComponent(searchTitle)}`;
    const searchRes = await fetch(`${CORS_PROXY}${searchUrl}`);
    const searchData = await searchRes.json();
    
    // Pick the first search result (the most relevant one)
    const officialId = searchData.results?.[0]?.id;
    
    if (!officialId) {
      console.error("❌ Could not find a matching ID for:", searchTitle);
      return [];
    }

    console.log("✅ Match Found! Using ID:", officialId);

    // 3. Now fetch the stream using that official ID
    const streamUrl = `https://api.consumet.org/anime/gogoanime/watch/${officialId}-episode-${ep}`;
    const streamRes = await fetch(`${CORS_PROXY}${streamUrl}`);
    const streamData = await streamRes.json();

    const sources: { name: string; url: string }[] = [];
    
    if (streamData.sources) {
      streamData.sources.forEach((s: any) => {
        sources.push({ 
          name: s.quality.toUpperCase(), 
          url: `${CORS_PROXY}${s.url}` 
        });
      });
    }
    
    return sources;

  } catch (err) { 
    console.error("🔥 Stream Fetch Error:", err);
    return []; 
  }
};

export const calculateEpisodes = (anime: any) => {
  if (anime?.episodes) return anime.episodes;
  const name = anime?.title_english || anime?.title || "";
  if (name.includes("One Piece")) return 1100;
  return 12;
};