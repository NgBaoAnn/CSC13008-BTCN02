import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "@/components/movie/MovieCard";
import { getTopMovies } from "@/services/api";
import Skeleton from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function TopMovieSlider() {
  const [movies, setMovies] = useState([]);
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

  return (
    <section className="relative flex justify-center">
      <Carousel
        className="w-full max-w-md"
        opts={{ loop: true, align: "center" }}
      >
        <CarouselContent>
          {movies.map((movie) => (
            <CarouselItem key={movie.id}>
              <Link to={`/movie/${movie.id}`} className="block">
                <MovieCard
                  title={movie.title}
                  image={movie.image}
                  rate={movie.rate}
                  year={movie.year}
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="-left-12" />
        <CarouselNext className="-right-12" />
      </Carousel>
    </section>
  );
}

export default TopMovieSlider;
