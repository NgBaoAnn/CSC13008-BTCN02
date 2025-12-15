import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useFavorites from '@/hooks/useFavorites'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Skeleton from '@/components/ui/skeleton'
import MovieCard from '@/components/movie/MovieCard'
import BackButton from '@/components/common/BackButton'
import Spinner from '@/components/ui/spinner'

const Favorites = () => {
  const { favorites, loading, removeFavorite } = useFavorites({ autoLoad: true })
  const [removingId, setRemovingId] = useState(null)

  const items = Array.isArray(favorites) ? favorites : []

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
      <div className="w-full mx-auto mb-4 flex flex-start">
        <BackButton />
      </div>
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">My Favorites</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-[2/3] rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center gap-4">
          <p className="text-muted-foreground">No favorites yet. Start adding some!</p>
          <Button asChild>
            <Link to="/">Browse movies</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((raw) => {
            const m = (typeof raw === 'string' || typeof raw === 'number') ? { id: raw } : (raw || {})
            const id = m.id
            const title = m.title || 'Untitled Movie'
            const year = m.release_year
            const image = m.image_url
            const rate = m.external_ratings?.imDb
            return (
              <Card key={id} className="border-0 shadow-md">
                <CardContent className="p-0">
                  <Link to={`/movie/${id}`} className="block">
                    <MovieCard title={title} image={image} rate={rate} year={year} />
                  </Link>
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-3">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (!id || removingId) return
                      setRemovingId(id)
                      try {
                        await removeFavorite(id)
                      } finally {
                        setRemovingId(null)
                      }
                    }}
                    disabled={!id || removingId === id}
                    className="relative"
                  >
                    {removingId === id ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="h-4 w-4" />
                        Removing...
                      </span>
                    ) : (
                      'Remove'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Favorites
