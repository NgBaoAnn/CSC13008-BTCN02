import React from 'react';

const MovieCard = ({
  title = "Movie Title",
  image,
  rate,
  year,
  badge,
}) => {
  return (
    <div className="group relative w-full max-w-[420px] mx-auto cursor-pointer">
      <div className="overflow-hidden rounded-lg">
        <div className="relative">
          <div className="aspect-[2/3] rounded-lg transform transition-all duration-300 scale-80 group-hover:scale-100 group-hover:shadow-lg group-hover:shadow-black/40 dark:border dark:border-slate-800">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover rounded-md"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-gray-300 flex items-center justify-center rounded-md dark:bg-slate-950">
                <div className="text-center text-gray-500 dark:text-slate-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                  <p className="text-sm font-medium">Movie Poster</p>
                </div>
              </div>
            )}
          </div>

          {/* Rank badge */}
          {badge && (
            <div className="absolute top-3 left-3 bg-sky-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
              {badge}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute left-0 right-0 bottom-0 px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-white text-lg font-semibold line-clamp-2">{title}</h3>
            <div className="mt-1 text-sm text-gray-200 space-x-3">
              {rate !== undefined && (
                <span>
                  <span className="font-medium">Rating:</span> {rate}
                </span>
              )}
              {year !== undefined && (
                <span className="ml-3">
                  <span className="font-medium">Year:</span> {year}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
