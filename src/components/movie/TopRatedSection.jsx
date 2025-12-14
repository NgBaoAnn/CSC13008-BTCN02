import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import { getTopRated } from "@/services/api";
import { useNavigate } from "react-router-dom";

// Fetch 15 per API request, display 3 per slide
const API_LIMIT = 15;
const VIEW_SIZE = 3;

const TopRatedSection = () => {
  const [apiPage, setApiPage] = useState(1); // API pagination page (batches of 15)
  const [movies, setMovies] = useState([]); // current batch of up to 15
  const [totalPages, setTotalPages] = useState(1); // total API pages
  const [viewIndex, setViewIndex] = useState(0); // start index within current batch
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, pagination } = await getTopRated(apiPage, API_LIMIT);
        if (!mounted) return;
        setMovies(data);
        setTotalPages(pagination?.total_pages ?? 1);
        setViewIndex(0); // reset view window when new batch loads
      } catch (err) {
        console.error("Failed to fetch top rated:", err);
        if (!mounted) return;
        setError("Failed to load Top Rated movies");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [apiPage]);

  const prevSlide = async () => {
    if (loading) return;
    if (viewIndex > 0) {
      setViewIndex((i) => Math.max(0, i - VIEW_SIZE));
      return;
    }
    // need previous batch
    if (apiPage > 1) {
      try {
        setLoading(true);
        const prevApiPage = apiPage - 1;
        const { data } = await getTopRated(prevApiPage, API_LIMIT);
        setMovies(data);
        setApiPage(prevApiPage);
        // move to last full view within the batch
        const lastStart = Math.max(0, Math.floor((Math.max(0, data.length - VIEW_SIZE)) / VIEW_SIZE) * VIEW_SIZE);
        setViewIndex(lastStart);
      } catch (err) {
        console.error("Failed to fetch previous batch:", err);
        setError("Failed to load previous movies");
      } finally {
        setLoading(false);
      }
    }
  };

  const nextSlide = async () => {
    if (loading) return;
    const canAdvanceInBatch = viewIndex + VIEW_SIZE < movies.length;
    if (canAdvanceInBatch) {
      setViewIndex((i) => i + VIEW_SIZE);
      return;
    }
    // need next batch
    if (apiPage < totalPages) {
      try {
        setLoading(true);
        const nextApiPage = apiPage + 1;
        const { data } = await getTopRated(nextApiPage, API_LIMIT);
        setMovies(data);
        setApiPage(nextApiPage);
        setViewIndex(0);
      } catch (err) {
        console.error("Failed to fetch next batch:", err);
        setError("Failed to load more movies");
      } finally {
        setLoading(false);
      }
    }
  };

  const onClickMovie = (id) => {
    if (!id) return;
    navigate(`/movie/${id}`);
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 dark:text-slate-50 text-left">Top Rating</h2>

      <div className="flex items-center gap-4">
        <button
          aria-label="Previous"
          onClick={prevSlide}
          disabled={(apiPage === 1 && viewIndex === 0) || loading}
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
            movies.slice(viewIndex, viewIndex + VIEW_SIZE).map((m) => (
              <div key={m.id} className="group" onClick={() => onClickMovie(m.id)}>
                <MovieCard
                  id={m.id}
                  title={m.title}
                  year={m.year}
                  rate={m.rate}
                  image={m.image}
                  badge={`#${m.rank ?? "-"}`}
                />
              </div>
            ))
          )}
        </div>

        <button
          aria-label="Next"
          onClick={nextSlide}
          disabled={(apiPage >= totalPages && viewIndex + VIEW_SIZE >= movies.length) || loading}
          className="text-gray-400 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={24} className="dark:text-slate-400 dark:hover:text-sky-500 transition" />
        </button>
      </div>

    </section>
  );
};

export default TopRatedSection;
