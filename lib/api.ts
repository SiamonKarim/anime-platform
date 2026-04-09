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
    // 1. Clean the title for a perfect search
    const searchTitle = animeTitle.split(':')[0].split('(')[0].replace('Part', '').trim();
    
    // 2. SEARCH via the Gogoanime provider
    const searchUrl = `https://api.consumet.org/anime/gogoanime/${encodeURIComponent(searchTitle)}`;
    const searchRes = await fetch(`${CORS_PROXY}${searchUrl}`);
    const searchData = await searchRes.json();
    
    if (!searchData.results || searchData.results.length === 0) return [];

    // 3. FIND THE BEST MATCH (Ignore movies/specials)
    // We look for the result that has 'one-piece' in the ID but NOT 'movie' or 'special'
    let officialId = searchData.results[0].id;

    const mainSeries = searchData.results.find((result: any) => 
      !result.id.includes('movie') && 
      !result.id.includes('special') &&
      !result.id.includes('dub') // Priority to Sub for speed
    );

    if (mainSeries) officialId = mainSeries.id;

    console.log("🎯 Match Found! Official ID:", officialId);

    // 4. FETCH THE STREAM
    const streamUrl = `https://api.consumet.org/anime/gogoanime/watch/${officialId}-episode-${ep}`;
    const streamRes = await fetch(`${CORS_PROXY}${streamUrl}`);
    
    if (!streamRes.ok) throw new Error("Stream server down");
    
    const streamData = await streamRes.json();
    const sources: { name: string; url: string }[] = [];
    
    if (streamData.sources) {
      streamData.sources.forEach((s: any) => {
        sources.push({ 
          name: s.quality === 'default' ? 'AUTO' : s.quality.toUpperCase(), 
          url: `${CORS_PROXY}${s.url}` 
        });
      });
    }
    
    return sources;

  } catch (err) { 
    console.error("🔥 PROXIED FETCH FAILED:", err);
    return []; 
  }
};

export const calculateEpisodes = (anime: any) => {
  if (anime?.episodes) return anime.episodes;
  const name = anime?.title_english || anime?.title || "";
  if (name.includes("One Piece")) return 1100;
  return 12;
};