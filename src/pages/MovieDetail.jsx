import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getMovieDetail } from "@/services/api"
import ExpandableText from "@/components/common/Exandabletext"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PersonCard from "@/components/common/PersonCard"



const MovieDetail = () => {
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchMovie() {
      try {
        setLoading(true)
        const data = await getMovieDetail(id)
        if (!cancelled) setMovie(data)
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load movie")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id) fetchMovie()
    return () => (cancelled = true)
  }, [id])

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-400">
        Loading movie…
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  if (!movie) return null

  /* ================= DATA ================= */

  const {
    title,
    year,
    image,
    rate,
    runtime,
    genres,
    plot_full,
    short_description,
    awards,
    directors,
    actors,
  } = movie

  const poster = image || "https://via.placeholder.com/400x600"
  const safeGenres = Array.isArray(genres) ? genres : []
  const safeDirectors = Array.isArray(directors) ? directors : []
  const safeActors = Array.isArray(actors) ? actors : []

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto">
      {/* ===== COVER (POSTER AS HERO) ===== */}
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <img
          src={poster}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />
      </div>

      {/* ===== CONTENT BELOW COVER ===== */}
      <div className="px-6 md:px-10 py-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">
            {title}
            {year && (
              <span className="ml-2 text-gray-500 font-normal">({year})</span>
            )}
          </h1>

        {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {typeof rate === "number" ? (
              <Badge variant="secondary" className="gap-1">{rate.toFixed(1)}</Badge>
            ) : (
              <Badge variant="outline">No rating</Badge>
            )}

            {runtime && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-700">{runtime}</span>
              </>
            )}

            {safeGenres.length > 0 && (
              <>
                <span className="text-gray-400">•</span>
                <div className="flex flex-wrap gap-2">
                  {safeGenres.map((g) => (
                    <Badge key={g} variant="outline">{g}</Badge>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Short description */}
          {short_description && (
            <p className="text-gray-700 leading-relaxed max-w-3xl">{short_description}</p>
          )}

          {plot_full && (
            <ExpandableText
              text={plot_full}
              step={350}
              className="mt-4 border-l-4 border-red-600 pl-4 text-left"
            />
          )}

          {/* Awards */}
          {awards && (
            <Alert className="mt-4 text-left">
              <AlertDescription>🏆 {awards}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* ===== PEOPLE ===== */}
      <div className="mt-14 space-y-10">
        {/* Directors */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-left">Directors</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeDirectors.map((d) => (
              <li key={d.id || d.name}>
                <PersonCard image={d.image} name={d.name} subtitle={d.role || "Director"} />
              </li>
            ))}
          </ul>
        </section>

        {/* Actors */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-left">Actors</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {safeActors.map((a) => (
              <li key={a.id || a.name}>
                <PersonCard image={a.image} name={a.name} subtitle={a.character ? `as ${a.character}` : "Cast"} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default MovieDetail
