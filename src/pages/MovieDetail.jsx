import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getMovieDetail } from "@/services/api"

const MovieDetail = () => {
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchMovie() {
      setLoading(true)
      setError(null)

      try {
        const data = await getMovieDetail(id)
        if (!cancelled) {
          setMovie(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to load movie")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (id) fetchMovie()

    return () => {
      cancelled = true
    }
  }, [id])

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-sm text-gray-500">
          Loading movie details…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="rounded-md bg-red-50 px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-sm text-gray-500">
          No data available.
        </div>
      </div>
    )
  }

  /* ================= DATA ================= */

  const {
    title,
    year,
    image,
    rate,
    runtime,
    genres,
    plot_full,
    awards,
    directors,
    actors,
  } = movie

  const poster = image || "https://via.placeholder.com/400x600?text=No+Image"
  const safeGenres = Array.isArray(genres) ? genres : []
  const safeDirectors = Array.isArray(directors) ? directors : []
  const safeActors = Array.isArray(actors) ? actors : []

  /* ================= UI ================= */

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* ===== TOP ===== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Poster */}
        <div className="md:col-span-4">
          <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img
              src={poster}
              alt={`${title || "Movie"} poster`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-8 flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            {title || "Untitled"}
            {year && (
              <span className="ml-2 text-gray-500 text-xl">
                ({year})
              </span>
            )}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {typeof rate === "number" ? (
              <span className="inline-flex items-center rounded-md bg-yellow-100 px-2.5 py-1 font-medium text-yellow-800">
                ⭐ {rate.toFixed(1)} / 10
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-gray-600">
                No rating
              </span>
            )}

            <span className="text-gray-500">•</span>
            <span className="text-gray-700">
              {runtime || "N/A"}
            </span>

            {safeGenres.length > 0 && (
              <>
                <span className="text-gray-500">•</span>
                <span className="text-gray-700">
                  {safeGenres.join(", ")}
                </span>
              </>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Plot
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {plot_full || "No description available."}
            </p>
          </div>

          {awards && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Awards
              </h3>
              <p className="text-gray-700">{awards}</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== PEOPLE ===== */}
      <div className="mt-10 space-y-8">
        {/* Directors */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Directors
          </h2>

          {safeDirectors.length === 0 ? (
            <p className="text-sm text-gray-500">
              No director information.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeDirectors.map((d) => (
                <li
                  key={d.id || d.name}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 bg-white"
                >
                  <img
                    src={d.image || "https://via.placeholder.com/64"}
                    alt={d.name}
                    className="w-14 h-14 object-cover rounded-md"
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {d.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {d.role || "Director"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Actors */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Actors
          </h2>

          {safeActors.length === 0 ? (
            <p className="text-sm text-gray-500">
              No actor information.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {safeActors.map((a) => (
                <li
                  key={a.id || a.name}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 bg-white"
                >
                  <img
                    src={a.image || "https://via.placeholder.com/64"}
                    alt={a.name}
                    className="w-14 h-14 object-cover rounded-md"
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {a.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {a.character ? `as ${a.character}` : "Cast"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default MovieDetail
