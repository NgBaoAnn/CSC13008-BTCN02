import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import TopMovieSlider from "@/components/movie/TopMovieSlider";
import MostPopularSection from "@/components/movie/MostPopularSection";

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
        <section>
          <h2 className="text-xl font-semibold mb-4 dark:text-slate-50 text-left">Top Rating</h2>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-700">
              <ChevronLeft size={24} className="dark:text-slate-400 dark:hover:text-sky-500 transition" />
            </button>

            <div className="grid grid-cols-3 gap-6 flex-1 dark:p-4 dark:rounded-lg">
              <MovieCard featured/>
              <MovieCard featured/>
              <MovieCard featured/>
            </div>

            <button className="text-gray-400 hover:text-gray-700">
              <ChevronRight size={24} className="dark:text-slate-400 dark:hover:text-sky-500 transition" />
            </button>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Home;
