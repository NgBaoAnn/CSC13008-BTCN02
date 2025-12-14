import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import { getTopRated } from "@/services/api";
import { useNavigate } from "react-router-dom";

const LIMIT = 3;

const TopRatedSection = () => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, pagination } = await getTopRated(page, LIMIT);
        if (!mounted) return;
        setMovies(data);
        setTotalPages(pagination?.total_pages ?? 1);
      } catch (err) {
        console.error("Failed to fetch top rated:", err);
        if (!mounted) return;
        setError("Failed to load Top Rated movies");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [page]);

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  const onClickMovie = (id) => {
    if (!id) return;
    navigate(`/movie/${id}`);
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 dark:text-slate-50 text-left">Top Rating</h2>

      <div className="flex items-center gap-4">
        <button
          aria-label="Previous page"
          onClick={prevPage}
          disabled={page === 1 || loading}
          className="text-gray-400 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={24} className="dark:text-slate-400 dark:hover:text-sky-500 transition" />
        </button>

        <div className="grid grid-cols-3 gap-6 flex-1 dark:p-4 dark:rounded-lg">
          {loading ? (
            <div className="col-span-3 text-center text-gray-500 dark:text-slate-400">Loading...</div>
          ) : error ? (
            <div className="col-span-3 text-center text-red-500">{error}</div>
          ) : movies.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500 dark:text-slate-400">No movies found</div>
          ) : (
            movies.map((m) => (
              <div key={m.id} className="group" onClick={() => onClickMovie(m.id)}>
                <MovieCard
                  featured
                  id={m.id}
                  title={m.title}
                  year={m.year}
                  rating={m.rate}
                  image={m.image}
                  badge={`#${m.rank ?? "-"}`}
                />
              </div>
            ))
          )}
        </div>

        <button
          aria-label="Next page"
          onClick={nextPage}
          disabled={page >= totalPages || loading}
          className="text-gray-400 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={24} className="dark:text-slate-400 dark:hover:text-sky-500 transition" />
        </button>
      </div>

      <div className="mt-2 text-sm text-gray-500 dark:text-slate-400 text-right">
        Page {page} / {totalPages}
      </div>
    </section>
  );
};

export default TopRatedSection;
