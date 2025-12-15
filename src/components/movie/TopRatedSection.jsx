import React, { useEffect, useState } from "react";
import MovieCard from "@/components/movie/MovieCard";
import { getTopRated } from "@/services/api";
import { useNavigate } from "react-router-dom";
import Skeleton from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
      <h2 className="text-xl font-semibold dark:text-slate-50 text-left">Top Rating</h2>

      <div className="relative">
        <Carousel className="w-full" opts={{ loop: false, align: "start" }}>
          <CarouselContent>
            {loading ? (
              <>
                <CarouselItem className="md:basis-1/3 sm:basis-1/2">
                  <Skeleton className="h-64 w-full" />
                </CarouselItem>
                <CarouselItem className="md:basis-1/3 sm:basis-1/2">
                  <Skeleton className="h-64 w-full" />
                </CarouselItem>
                <CarouselItem className="md:basis-1/3 sm:basis-1/2">
                  <Skeleton className="h-64 w-full" />
                </CarouselItem>
              </>
            ) : error ? (
              <CarouselItem className="md:basis-full">
                <div className="text-center text-red-500">{error}</div>
              </CarouselItem>
            ) : movies.length === 0 ? (
              <CarouselItem className="md:basis-full">
                <div className="text-center text-gray-500 dark:text-slate-400">No movies found</div>
              </CarouselItem>
            ) : (
              movies.slice(viewIndex, viewIndex + VIEW_SIZE).map((m) => (
                <CarouselItem key={m.id} className="md:basis-1/3 sm:basis-1/2">
                  <div className="group" onClick={() => onClickMovie(m.id)}>
                    <MovieCard
                      id={m.id}
                      title={m.title}
                      year={m.year}
                      rate={m.rate}
                      image={m.image}
                      badge={`#${m.rank ?? "-"}`}
                    />
                  </div>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious
            onClick={prevSlide}
            disabled={(apiPage === 1 && viewIndex === 0) || loading}
            aria-label="Previous top rated"
          />
          <CarouselNext
            onClick={nextSlide}
            disabled={(apiPage >= totalPages && viewIndex + VIEW_SIZE >= movies.length) || loading}
            aria-label="Next top rated"
          />
        </Carousel>
      </div>

    </section>
  );
};

export default TopRatedSection;
