const API_URL = import.meta.env.VITE_MOVIE_API_URL;
const API_TOKEN = import.meta.env.VITE_MOVIE_API_TOKEN;

/**
 * Fetch Top 5 most popular movies
 * @returns {Promise<Array>}
 */
export async function getTopMovies() {
  const res = await fetch(`${API_URL}/movies/most-popular?page=1&limit=5`, {
    headers: {
      "x-app-token": API_TOKEN,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  return Array.isArray(json?.data) ? json.data.slice(0, 5) : [];
}

/**
 * Fetch Most Popular movies with pagination
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<{ data: Array, pagination: { current_page: number, total_pages: number } }>} 
 */
export async function getMostPopular(page = 1, limit = 15) {
  const url = `${API_URL}/movies/most-popular?page=${page}&limit=${limit}`;
  const res = await fetch(url, {
    headers: {
      "x-app-token": API_TOKEN,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  return {
    data: Array.isArray(json?.data) ? json.data : [],
    pagination: json?.pagination ?? { current_page: page, total_pages: 1 },
  };
}
