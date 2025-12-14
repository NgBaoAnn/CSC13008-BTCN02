import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCard from "@/components/movie/MovieCard";
import { getMostPopular } from "@/services/api";

function MostPopularSection() {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const { data, pagination } = await getMostPopular(p, 3);
      setMovies(data);
      setTotalPages(pagination?.total_pages ?? 1);
    } catch (e) {
      console.error("Most Popular fetch error:", e);
      setError("Failed to load Most Popular movies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const prev = () => {
    if (canPrev) setPage((p) => Math.max(1, p - 1));
  };
  const next = () => {
    if (canNext) setPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <section>
      <h2 className="text-xl font-semibold dark:text-slate-50 text-left">Most Popular</h2>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <span className="text-gray-500 dark:text-slate-300">Loading…</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-6">
          <span className="text-red-600 dark:text-red-400">{error}</span>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            disabled={!canPrev}
            className={`text-gray-400 transition ${canPrev ? "hover:text-gray-700" : "opacity-50 cursor-not-allowed"}`}
            aria-label="Previous page"
          >
            <ChevronLeft size={24} className="dark:text-slate-400 dark:hover:text-sky-500 transition" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 flex-1 dark:p-4 dark:rounded-lg">
            {movies.map((m) => (
              <Link key={m.id} to={`/movie/${m.id}`} className="block">
                <MovieCard featured title={m.title} image={m.image} rate={m.rate} year={m.year} />
              </Link>
            ))}
          </div>

          <button
            onClick={next}
            disabled={!canNext}
            className={`text-gray-400 transition ${canNext ? "hover:text-gray-700" : "opacity-50 cursor-not-allowed"}`}
            aria-label="Next page"
          >
            <ChevronRight size={24} className="dark:text-slate-400 dark:hover:text-sky-500 transition" />
          </button>
        </div>
      )}

    </section>
  );
}

export default MostPopularSection;
