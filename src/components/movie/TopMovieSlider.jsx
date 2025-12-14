import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCard from "@/components/movie/MovieCard";

const API_URL = "https://34.124.214.214:2423/api/movies/most-popular?page=1&limit=5";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

function TopMovieSlider() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL, {
          headers: {
            "x-app-token": API_TOKEN,
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data.slice(0, 5) : [];
        if (!cancelled) {
          setMovies(list);
        }
      } catch (e) {
        console.error("Top 5 movies fetch error:", e);
        if (!cancelled) setError("Failed to load Top 5 movies.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchMovies();
    return () => {
      cancelled = true;
    };
  }, []);

  const prev = useCallback(() => {
    setCurrent((idx) => (movies.length ? (idx - 1 + movies.length) % movies.length : 0));
  }, [movies.length]);

  const next = useCallback(() => {
    setCurrent((idx) => (movies.length ? (idx + 1) % movies.length : 0));
  }, [movies.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-gray-500 dark:text-slate-300">Loading Top 5 Movies…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-red-600 dark:text-red-400">{error}</span>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-gray-500 dark:text-slate-300">No movies to show.</span>
      </div>
    );
  }

  const movie = movies[current];

  return (
    <section className="relative">
      <div className="flex items-center justify-center gap-10 dark:bg-slate-900 dark:rounded-lg">
        <button
          aria-label="Previous"
          onClick={prev}
          className="p-2 text-gray-400 hover:text-gray-700 transition"
        >
          <ChevronLeft size={32} className="dark:text-slate-400 dark:hover:text-sky-500 transition" />
        </button>

        <div className="flex-1 flex justify-center">
          <Link to={`/movie/${movie.id}`} className="block w-full max-w-md">
            <MovieCard
              featured
              title={movie.title}
              image={movie.image}
              rate={movie.rate}
              year={movie.year}
            />
          </Link>
        </div>

        <button
          aria-label="Next"
          onClick={next}
          className="p-2 text-gray-400 hover:text-gray-700 transition"
        >
          <ChevronRight size={32} className="dark:text-slate-400 dark:hover:text-sky-500 transition" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full ${i === current ? "bg-sky-500" : "bg-gray-300 dark:bg-slate-600"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default TopMovieSlider;
