import React from 'react';

const MovieCard = ({ title = "Movie Title", featured = false }) => {
  if (featured) {
    return (
      <div className="group relative w-full max-w-[420px] mx-auto cursor-pointer">
        {/* Poster */}
        <div className="overflow-hidden rounded-lg">
          <div className="relative">
            <div className="aspect-[2/3] bg-gray-300 rounded-lg transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
              <div className="h-full w-full flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-24 w-24 text-gray-500" 
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
              </div>
            </div>

            {/* Title overlay (hidden initially, appears on hover) */}
            <div className="absolute left-0 right-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white text-lg font-semibold line-clamp-2">
                {title}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular (grid) card layout
  return (
    <div className="flex flex-col gap-2 cursor-pointer group">
      {/* Movie Poster Placeholder */}
      <div className="relative bg-gray-300 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
        <div className="aspect-[2/3] flex items-center justify-center">
          <div className="text-center text-gray-500">
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
      </div>

      {/* Movie Title */}
      <div className="px-1">
        <h3 className="font-medium text-gray-800 text-center line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default MovieCard;
