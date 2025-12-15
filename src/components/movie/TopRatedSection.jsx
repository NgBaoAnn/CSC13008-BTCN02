import React, { useEffect, useState } from "react";
import MovieCard from "@/components/movie/MovieCard";
import { getTopRated } from "@/services/api";
import Skeleton from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Fetch 15 per API request, display 3 per slide
const API_LIMIT = 15;

const TopRatedSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getTopRated(1, API_LIMIT);
        if (!mounted) return;
        setMovies(data);
      } catch (err) {
        console.error("Failed to fetch top rated:", err);
        if (!mounted) return;
        setError("Failed to load Top Rated movies");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold dark:text-slate-50 text-left">Top Rating</h2>

      {loading ? (
        <div className="grid grid-cols-3 gap-6 flex-1 dark:p-4 dark:rounded-lg">
          <MovieCard loading />
          <MovieCard loading />
          <MovieCard loading />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : movies.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-slate-400 py-4">No movies found</div>
      ) : (
        <div className="relative">
          <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
            <CarouselContent>
              {movies.map((m) => (
                <CarouselItem key={m.id} className="sm:basis-1/2 md:basis-1/3">
                  <Link to={`/movie/${m.id}`} className="block">
                    <MovieCard
                      id={m.id}
                      title={m.title}
                      year={m.year}
                      rate={m.rate}
                      image={m.image}
                      badge={`#${m.rank ?? "-"}`}
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </Carousel>
        </div>
      )}

    </section>
  );
};

export default TopRatedSection;
