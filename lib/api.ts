// --- PRO MULTI-SERVER ENGINE ---
export const fetchVideoStream = async (animeTitle: string, ep: number) => {
  try {
    const slug = animeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const res = await fetch(`${CORS_PROXY}${STREAM_API}/${slug}-episode-${ep}`);
    
    if (!res.ok) return [];
    const data = await res.json();

    // We now return ALL available servers/qualities
    // This usually includes 'main', 'backup', and different resolutions
    const sources = [];
    
    if (data.data?.stream?.multi) {
      Object.keys(data.data.stream.multi).forEach(serverName => {
        sources.push({
          name: serverName.toUpperCase(),
          url: data.data.stream.multi[serverName]
        });
      });
    }

    // Wrap all URLs in your proxy
    return sources.map(s => ({
      ...s,
      url: `${CORS_PROXY}${s.url}`
    }));
  } catch (err) {
    return [];
  }
};

// ADD SEARCH FUNCTION FOR THE NEW SEARCH PAGE
export const searchAnime = async (query: string) => {
  const res = await fetch(`${JIKAN_URL}/anime?q=${query}&limit=20`);
  const data = await res.json();
  return data.data || [];
};