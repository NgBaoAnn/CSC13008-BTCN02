import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCard from "@/components/movie/MovieCard";
import { getMostPopular } from "@/services/api";

function MostPopularSection() {
  const [chunkPage, setChunkPage] = useState(1); // page fetching 15 items
  const [movies, setMovies] = useState([]); // 0..14 within chunk
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowStart, setWindowStart] = useState(0); // start index of 3-card window

  const fetchChunk = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const { data, pagination } = await getMostPopular(p, 15);
      setMovies(data);
      setTotalPages(pagination?.total_pages ?? 1);
      setWindowStart(0);
    } catch (e) {
      console.error("Most Popular fetch error:", e);
      setError("Failed to load Most Popular movies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChunk(chunkPage);
  }, [chunkPage, fetchChunk]);

  const canPrevChunk = chunkPage > 1;
  const canNextChunk = chunkPage < totalPages;

  const prev = () => {
    if (windowStart >= 3) {
      setWindowStart((s) => s - 3);
    } else if (canPrevChunk) {
      setChunkPage((p) => Math.max(1, p - 1));
      // After loading previous chunk set window to last full trio (index 12)
      setTimeout(() => setWindowStart(12), 0);
    }
  };

  const next = () => {
    if (windowStart + 3 <= 12 && windowStart + 3 < movies.length) {
      setWindowStart((s) => s + 3);
    } else if (canNextChunk) {
      setChunkPage((p) => Math.min(totalPages, p + 1));
      setTimeout(() => setWindowStart(0), 0);
    }
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
            disabled={!canPrevChunk && windowStart === 0}
            className={`text-gray-400 transition ${!canPrevChunk && windowStart === 0 ? "opacity-50 cursor-not-allowed" : "hover:text-gray-700"}`}
            aria-label="Previous"
          >
            <ChevronLeft size={24} className="dark:text-slate-400 dark:hover:text-sky-500 transition" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 flex-1 dark:p-4 dark:rounded-lg">
            {movies.slice(windowStart, windowStart + 3).map((m) => (
              <Link key={m.id} to={`/movie/${m.id}`} className="block">
                <MovieCard featured title={m.title} image={m.image} rate={m.rate} year={m.year} />
              </Link>
            ))}
          </div>

          <button
            onClick={next}
            disabled={!canNextChunk && (windowStart + 3 >= movies.length || windowStart >= 12)}
            className={`text-gray-400 transition ${!canNextChunk && (windowStart + 3 >= movies.length || windowStart >= 12) ? "opacity-50 cursor-not-allowed" : "hover:text-gray-700"}`}
            aria-label="Next"
          >
            <ChevronRight size={24} className="dark:text-slate-400 dark:hover:text-sky-500 transition" />
          </button>
        </div>
      )}

    </section>
  );
}

export default MostPopularSection;
