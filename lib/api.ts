const JIKAN_URL = 'https://api.jikan.moe/v4';
const STREAM_API = 'https://api.amvstr.me/api/v2'; 

export const fetchTrendingAnime = async () => {
  try {
    const res = await fetch(`${JIKAN_URL}/top/anime?filter=airing&limit=25`, { cache: 'no-store' });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    return []; 
  }
};

export const fetchAnimeById = async (id: string) => {
  try {
    const res = await fetch(`${JIKAN_URL}/anime/${id}/full`);
    const data = await res.json();
    return data.data;
  } catch (error) { return null; }
};

export const fetchAnimeEpisodes = async (id: string) => {
  try {
    const res = await fetch(`${JIKAN_URL}/anime/${id}/episodes`);
    const data = await res.json();
    return data.data || [];
  } catch (error) { return []; }
};

export const searchAnime = async (query: string) => {
  try {
    const res = await fetch(`${JIKAN_URL}/anime?q=${query}&sfw=true`);
    const data = await res.json();
    return data.data || [];
  } catch (error) { return []; }
};

export const fetchVideoLink = async (title: string, ep: number) => {
  try {
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const res = await fetch(`${STREAM_API}/stream/${cleanTitle}-episode-${ep}`);
    if (!res.ok) throw new Error("Stream not found");
    
    const data = await res.json();
    return data.data?.stream?.multi?.main || data.data?.stream?.file || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  } catch (error) {
    return "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  }
};