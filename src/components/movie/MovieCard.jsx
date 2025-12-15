import React from 'react';
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Film } from "lucide-react"


const MovieCard = ({ title, image, rate, year, badge }) => {
  const [imgError, setImgError] = React.useState(false)

  return (
    <div className="group relative w-full max-w-[420px] mx-auto cursor-pointer">
      <AspectRatio
        ratio={2 / 3}
        className="rounded-lg overflow-hidden transform transition-all duration-300
                   scale-90 group-hover:scale-100
                   group-hover:shadow-lg group-hover:shadow-black/40"
      >
        {!imgError && image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          /* ===== POSTER FALLBACK ===== */
          <div className="flex h-full w-full flex-col items-center justify-center
                          bg-gradient-to-br from-zinc-900 to-zinc-800 text-zinc-300">
            <Film className="h-10 w-10 mb-3 opacity-70" />
            <p className="px-4 text-center text-sm font-medium line-clamp-3">
              {title || "Untitled Movie"}
            </p>
          </div>
        )}

        {/* Rank badge */}
        {badge && (
          <Badge
            variant="destructive"
            className="absolute top-3 left-3 z-10"
          >
            {badge}
          </Badge>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <h3 className="text-white text-lg font-semibold line-clamp-2">
            {title}
          </h3>
          <div className="mt-1 text-sm text-gray-200 space-x-3">
            {rate !== undefined && <span>⭐ {rate}</span>}
            {year !== undefined && <span>{year}</span>}
          </div>
        </div>
      </AspectRatio>
    </div>
  )
}

export default MovieCard