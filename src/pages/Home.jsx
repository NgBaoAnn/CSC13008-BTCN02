import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "../components/movie/MovieCard";

const Home = () => {
  return (
    <main className="bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-12">

        {/* ===== Featured Movie ===== */}
        <section className="flex items-center justify-center gap-10">
          <button className="p-2 text-gray-400 hover:text-gray-700 transition">
            <ChevronLeft size={32} />
          </button>

          <div className="flex-1 flex items-center justify-center">
            <MovieCard featured title="Featured Movie" />
          </div>

          <button className="p-2 text-gray-400 hover:text-gray-700 transition">
            <ChevronRight size={32} />
          </button>
        </section>

        {/* ===== Most Popular ===== */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Most Popular</h2>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-700">
              <ChevronLeft size={24} />
            </button>

            <div className="grid grid-cols-3 gap-6 flex-1">
              <MovieCard />
              <MovieCard />
              <MovieCard />
            </div>

            <button className="text-gray-400 hover:text-gray-700">
              <ChevronRight size={24} />
            </button>
          </div>
        </section>

        {/* ===== Top Rating ===== */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Top Rating</h2>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-700">
              <ChevronLeft size={24} />
            </button>

            <div className="grid grid-cols-3 gap-6 flex-1">
              <MovieCard />
              <MovieCard />
              <MovieCard />
            </div>

            <button className="text-gray-400 hover:text-gray-700">
              <ChevronRight size={24} />
            </button>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Home;
