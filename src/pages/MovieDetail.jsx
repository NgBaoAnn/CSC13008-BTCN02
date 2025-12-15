import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getMovieDetail } from "@/services/api"
import ExpandableText from "@/components/common/Exandabletext"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PersonCard from "@/components/common/PersonCard"
import ReviewList from "@/components/review/ReviewList"
import MovieCard from "@/components/movie/MovieCard"
import { Link } from "react-router-dom"
import Skeleton from "@/components/ui/skeleton"
import useFavorites from "@/hooks/useFavorites"
import FavoriteToggle from "@/components/movie/FavoriteToggle"
import BackButton from "@/components/common/BackButton";


const MovieDetail = () => {
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toggling, setToggling] = useState(false)

  const {
    loading: favLoading,
    isFavorite,
    toggleFavorite,
  } = useFavorites({ autoLoad: true })

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
      <div className="max-w-7xl mx-auto">
        <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
          <Skeleton className="absolute inset-0 w-full h-full" />
        </div>
        <div className="px-6 md:px-10 py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="mt-10">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex gap-4 overflow-x-auto pb-4">
              <Skeleton className="h-64 w-40" />
              <Skeleton className="h-64 w-40" />
              <Skeleton className="h-64 w-40" />
            </div>
          </div>
        </div>
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
    runtime,
    genres,
    plot_full,
    short_description,
    awards,
    directors,
    actors,
    countries,
    languages,
    ratings,
    similar_movies,
  } = movie

  const poster = image || "https://via.placeholder.com/400x600"
  const safeGenres = Array.isArray(genres) ? genres : []
  const safeDirectors = Array.isArray(directors) ? directors : []
  const safeActors = Array.isArray(actors) ? actors : []
  const safeCountries = Array.isArray(countries) ? countries : []
  const safeLanguages = Array.isArray(languages) ? languages : []
  const safeSimilar = Array.isArray(similar_movies) ? similar_movies : []

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto">
      {/* ===== COVER (POSTER AS HERO) ===== */}
      <div className="w-full mx-auto flex flex-start">
        <BackButton />
      </div>
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <img
          src={poster}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-black/20 to-black/70 dark:from-black/10 dark:via-black/40 dark:to-black/80" />
      </div>

      {/* ===== CONTENT BELOW COVER ===== */}
      <div className="px-6 md:px-10 py-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 text-left">
              {title}
              {year && (
                <span className="ml-2 text-gray-500 dark:text-slate-400 font-normal">({year})</span>

              )}
            </h1>
            {/* Favorite toggle */}
            <FavoriteToggle
              pressed={isFavorite(id)}
              onPressedChange={async () => {
                try {
                  setToggling(true)
                  await toggleFavorite(id)
                } finally {
                  setToggling(false)
                }
              }}
              disabled={favLoading || toggling}
              className="ml-1"
              size="sm"
            />
          </div>

        {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {(() => {
              const displayRate = ratings?.imDb
              return displayRate !== null && displayRate !== undefined && String(displayRate).trim() !== ""
                ? (<Badge variant="secondary" className="gap-1">IMDb: {String(displayRate)}</Badge>)
                : (<Badge variant="outline">No rating</Badge>)
            })()}

            {runtime && (
              <>
                <span className="text-gray-400 dark:text-slate-500">•</span>
                <Badge variant="secondary">{runtime}</Badge>
              </>
            )}

            {safeGenres.length > 0 && (
              <>
                <span className="text-gray-400 dark:text-slate-500">•</span>
                <div className="flex flex-wrap gap-2">
                  {safeGenres.map((g) => (
                    <Badge key={g} variant="outline">{g}</Badge>
                  ))}
                </div>
              </>
            )}

            {safeCountries.length > 0 && (
              <>
                <span className="text-gray-400 dark:text-slate-500">•</span>
                <div className="flex flex-wrap gap-2">
                  {safeCountries.map((c) => (
                    <Badge key={c} variant="outline">{c}</Badge>
                  ))}
                </div>
              </>
            )}

            {safeLanguages.length > 0 && (
              <>
                <span className="text-gray-400 dark:text-slate-500">•</span>
                <div className="flex flex-wrap gap-2">
                  {safeLanguages.map((l) => (
                    <Badge key={l} variant="outline">{l}</Badge>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Short description */}
          {short_description && (
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed max-w-3xl">{short_description}</p>
          )}

          {plot_full && (
            <ExpandableText
              text={plot_full}
              step={350}
              className="mt-4 border-l-4 border-red-600 pl-4 text-left "
            />
          )}

          {/* Awards */}
          {awards && (
            <Alert className="mt-4 text-left">
              <AlertDescription>🏆 {awards}</AlertDescription>
            </Alert>
          )}

          
        </div>


        <div className="mt-14 space-y-10">
          {/* ===== REVIEWS ===== */}
          <section className="px-6 md:px-10">
            <ReviewList movieId={id} initialLimit={5} />
          </section>

          {/* ===== SIMILAR MOVIES ===== */}
          {safeSimilar.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 text-xl font-semibold text-left text-gray-900 dark:text-slate-100">
                More Like This
              </h2>

              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {safeSimilar.map((m) => (
                    <Link
                      key={m.id}
                      to={`/movie/${m.id}`}
                      className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px]"
                    >
                      <MovieCard
                        title={m.title}
                        image={m.image}
                        rate={m.rate}
                        year={m.year}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </section>

          )}
          {/* Directors */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-left text-gray-900 dark:text-slate-100">Directors</h2>


            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeDirectors.map((d) => (
                <li key={d.id || d.name}>
                  {d?.id ? (
                    <Link to={`/person/${d.id}`}>
                      <PersonCard image={d.image} name={d.name} subtitle={d.role || "Director"} />
                    </Link>
                  ) : (
                    <PersonCard image={d.image} name={d.name} subtitle={d.role || "Director"} />
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Actors */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-left text-gray-900 dark:text-slate-100">Actors</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {safeActors.map((a) => (
                <li key={a.id || a.name}>
                  {a?.id ? (
                    <Link to={`/person/${a.id}`}>
                      <PersonCard image={a.image} name={a.name} subtitle={a.character ? `as ${a.character}` : "Cast"} />
                    </Link>
                  ) : (
                    <PersonCard image={a.image} name={a.name} subtitle={a.character ? `as ${a.character}` : "Cast"} />
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

    </div>
  )
}

export default MovieDetail
