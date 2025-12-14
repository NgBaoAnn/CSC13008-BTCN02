import React from 'react';
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"


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
          <AspectRatio
            ratio={2 / 3}
            className="rounded-lg overflow-hidden transform transition-all duration-300
                      scale-80 group-hover:scale-100
                      group-hover:shadow-lg group-hover:shadow-black/40
                      dark:border dark:border-slate-800"
          >
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </AspectRatio>


          {/* Rank badge */}
          {badge && (
            <Badge
              variant="destructive"
              className="absolute top-3 left-3"
            >
              {badge}
            </Badge>
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
