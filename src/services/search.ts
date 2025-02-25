export const fetchMovies = async (query: string, page: number = 0) => {
  if (!query) return [];

  try {
    const res = await fetch(`/api/search?q=${query}&page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch search results");

    const data = await res.json();
    return data.hits.hits || [];
  } catch (error) {
    console.error("🚨 Error fetching movies:", error);
    return [];
  }
};
