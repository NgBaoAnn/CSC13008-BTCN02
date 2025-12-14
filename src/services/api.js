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

/**
 * Fetch Top Rated movies (IMDB Top 50)
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<{ data: Array, pagination: { current_page: number, total_pages: number } }>} 
 */
export async function getTopRated(page = 1, limit = 3) {
  const category = "IMDB_TOP_50";
  const url = `${API_URL}/movies/top-rated?category=${category}&page=${page}&limit=${limit}`;
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

/**
 * Search movies by title
 * @param {string} title
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<{ data: Array, pagination: { total_items: number, current_page: number, total_pages: number, page_size: number } }>} 
 */
export async function searchMoviesByTitle(title, page = 1, limit = 12) {
  const q = encodeURIComponent(title ?? "");
  const url = `${API_URL}/movies/search?q=${q}&page=${page}&limit=${limit}`;
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
    pagination: json?.pagination ?? { current_page: page, total_pages: 1, total_items: 0, page_size: limit },
  };
}
