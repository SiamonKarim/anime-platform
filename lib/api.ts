const JIKAN_URL = 'https://api.jikan.moe/v4';
// 1. YOUR PRIVATE PROXY URL (Must end with /)
const CORS_PROXY = 'https://cors-qpo5.onrender.com/'; 
const CONSUMET_URL = 'https://api.consumet.org/anime/gogoanime';

export const fetchTrendingAnime = async () => {
  try {
    const res = await fetch(`${JIKAN_URL}/top/anime?filter=airing&limit=20`);
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

// 2. THE SMART AUTOMATION ENGINE
export const fetchVideoStream = async (animeTitle: string, ep: number) => {
  try {
    // STEP A: Clean the title for better search results
    const searchTitle = animeTitle.split(':')[0].split('(')[0].trim();
    
    // STEP B: Search the video server for the official ID
    const searchRes = await fetch(`${CORS_PROXY}${CONSUMET_URL}/${encodeURIComponent(searchTitle)}`);
    const searchData = await searchRes.json();
    
    const animeId = searchData.results?.[0]?.id;
    if (!animeId) return null;

    // STEP C: Fetch the actual .m3u8 streaming links
    const streamRes = await fetch(`${CORS_PROXY}${CONSUMET_URL}/watch/${animeId}-episode-${ep}`);
    const streamData = await streamRes.json();
    
    // STEP D: Find the HLS (.m3u8) source
    const hlsSource = streamData.sources?.find((s: any) => s.isM3U8) || streamData.sources?.[0];
    
    if (!hlsSource?.url) return null;

    // STEP E: Return the URL wrapped in your proxy
    return `${CORS_PROXY}${hlsSource.url}`;
  } catch (err) {
    console.error("Automation Error:", err);
    return null;
  }
};

export const calculateEpisodes = (anime: any) => {
  if (anime?.episodes) return anime.episodes;
  const name = anime?.title_english || anime?.title || "";
  if (name.includes("One Piece")) return 1100;
  return 12;
};