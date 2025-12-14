import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import TopMovieSlider from "@/components/movie/TopMovieSlider";
import MostPopularSection from "@/components/movie/MostPopularSection";
import TopRatedSection from "@/components/movie/TopRatedSection";

const Home = () => {
  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-5">

        {/* ===== Top 5 Movies (Box Office) ===== */}
        <section>
          <TopMovieSlider />
        </section>

        {/* ===== Most Popular ===== */}
        <MostPopularSection />

        {/* ===== Top Rating ===== */}
        <TopRatedSection />

      </div>
    </main>
  );
};

export default Home;
