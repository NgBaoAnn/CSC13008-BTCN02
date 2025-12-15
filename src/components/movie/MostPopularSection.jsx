import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import MovieCard from "@/components/movie/MovieCard";
import { getMostPopular } from "@/services/api";
import Skeleton from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function MostPopularSection() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChunk = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMostPopular(1, 15);
      setMovies(data);
    } catch (e) {
      console.error("Most Popular fetch error:", e);
      setError("Failed to load Most Popular movies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChunk();
  }, [fetchChunk]);

  return (
    <section>
      <h2 className="text-xl font-semibold dark:text-slate-50 text-left">Most Popular</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 flex-1 dark:p-4 dark:rounded-lg gap-6">
          <MovieCard loading />
          <MovieCard loading />
          <MovieCard loading />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-6">
          <span className="text-red-600 dark:text-red-400">{error}</span>
        </div>
      ) : (
        <div className="relative">
          <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
            <CarouselContent>
              {movies.map((m) => (
                <CarouselItem key={m.id} className="sm:basis-1/2 md:basis-1/3">
                  <Link to={`/movie/${m.id}`} className="block">
                    <MovieCard featured title={m.title} image={m.image} rate={m.rate} year={m.year} />
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
}

export default MostPopularSection;
