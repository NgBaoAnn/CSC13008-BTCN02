import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCard from "@/components/movie/MovieCard";
import { getTopMovies } from "@/services/api";
import Skeleton from "@/components/ui/skeleton";

function TopMovieSlider() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTopMovies() {
      try {
        setLoading(true);
        const list = await getTopMovies();
        if (!cancelled) setMovies(list);
      } catch (e) {
        console.error("Load top movies error:", e);
        if (!cancelled) setError("Failed to load Top 5 movies.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTopMovies();
    return () => {
      cancelled = true;
    };
  }, []);

  const prev = useCallback(() => {
    setCurrent((i) => (movies.length ? (i - 1 + movies.length) % movies.length : 0));
  }, [movies.length]);

  const next = useCallback(() => {
    setCurrent((i) => (movies.length ? (i + 1) % movies.length : 0));
  }, [movies.length]);

  if (loading) {
    return (
      <section className="relative">
        <div className="flex items-center justify-center gap-10">
          <Skeleton className="h-8 w-8" />
          <div className="max-w-md w-full">
            <MovieCard loading title="" image="" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </section>
    );
  }
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!movies.length) return <p className="text-center py-8">No movies</p>;

  const movie = movies[current];

  return (
    <section className="relative">
      <div className="flex items-center justify-center gap-10">
        <button className="cursor-pointer hover:opacity-75 hover:scale-105" onClick={prev}>
          <ChevronLeft size={32} />
        </button>

        <Link to={`/movie/${movie.id}`} className="max-w-md w-full">
          <MovieCard
            title={movie.title}
            image={movie.image}
            rate={movie.rate}
            year={movie.year}
          />
        </Link>

        <button className="cursor-pointer hover:opacity-75 hover:scale-105" onClick={next}>
          <ChevronRight  size={32} />
        </button>
      </div>
    </section>
  );
}

export default TopMovieSlider;
