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

/**
 * Fetch reviews for a given movie id
 * @param {string} movieId
 * @param {number} page
 * @param {number} limit
 * @param {"newest"|"oldest"|"highest"|"lowest"} sort
 * @returns {Promise<{ data: Array, pagination: { total_items: number, current_page: number, total_pages: number, page_size: number } }>} 
 */
export async function getMovieReviews(movieId, page = 1, limit = 5, sort = 'newest') {
  if (!movieId) throw new Error('Movie id is required');
  const url = `${API_URL}/movies/${encodeURIComponent(movieId)}/reviews?page=${page}&limit=${limit}&sort=${encodeURIComponent(sort)}`;
  const res = await fetch(url, {
    headers: { 'x-app-token': API_TOKEN },
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
/**
 * Get movie detail by id
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function getMovieDetail(id) {
  if (!id) {
    throw new Error("Movie id is required")
  }

  const res = await fetch(
    `${API_URL}/movies/${encodeURIComponent(id)}`,
    {
      headers: {
        "x-app-token": API_TOKEN,
      },
    }
  )

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Movie not found")
    }
    throw new Error(`Failed to load movie (HTTP ${res.status})`)
  }

  const data = await res.json()
  return data ?? null
}

/**
 * Get person detail by id
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getPersonDetail(id) {
  if (!id) {
    throw new Error("Person id is required")
  }

  const res = await fetch(
    `${API_URL}/persons/${encodeURIComponent(id)}`,
    {
      headers: {
        "x-app-token": API_TOKEN,
      },
    }
  )

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Person not found")
    }
    throw new Error(`Failed to load person (HTTP ${res.status})`)
  }

  const data = await res.json()
  return data ?? null
}

/**
 * Register a new user
 * @param {{username:string,email:string,password:string,phone:string,dob:string}} payload
 * @returns {Promise<{ message: string }>}
 */
export async function registerUser(payload) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-token': API_TOKEN,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || `Register failed (HTTP ${res.status})`);
  }
  return json;
}

/**
 * Login user
 * @param {{username:string,password:string}} payload
 * @returns {Promise<{ token: string, user: object, message?: string }>}
 */
export async function loginUser(payload) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-token': API_TOKEN,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || `Login failed (HTTP ${res.status})`);
  }
  return json;
}

/**
 * Logout user
 * @returns {Promise<{ message?: string }>}
 */
export async function logoutUser() {
  const res = await fetch(`${API_URL}/api/users/logout`, {
    method: 'POST',
    headers: {
      'x-app-token': API_TOKEN,
    },
  });
  // Some APIs return 204 No Content
  if (res.status === 204) return { message: 'Logged out' };
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || `Logout failed (HTTP ${res.status})`);
  }
  return json;
}