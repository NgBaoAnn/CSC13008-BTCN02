import React from 'react'
import { Link } from 'react-router-dom'
import useFavorites from '@/hooks/useFavorites'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Skeleton from '@/components/ui/skeleton'

const Favorites = () => {
  const { favorites, loading, removeFavorite } = useFavorites({ autoLoad: true })

  const items = Array.isArray(favorites) ? favorites : []

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
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
          {items.map((m) => {
            const id = m?.id
            const title = m?.title || 'Untitled'
            const year = m?.year ? ` (${m.year})` : ''
            const image = m?.image || 'https://via.placeholder.com/400x600'
            return (
              <Card key={id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Link to={`/movie/${id}`}>
                    <img src={image} alt={title} className="w-full aspect-[2/3] object-cover" />
                  </Link>
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-3">
                  <Link to={`/movie/${id}`} className="text-left font-medium line-clamp-1">
                    {title}{year}
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => removeFavorite(id)}
                  >
                    Remove
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
