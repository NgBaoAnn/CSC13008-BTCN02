import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { addFavorite, getFavorites, removeFavorite } from '../services/api'

/**
 * Favorites state manager with optimistic updates
 */
export default function useFavorites({ autoLoad = true } = {}) {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(Boolean(autoLoad))
  const [error, setError] = useState(null)
  const inflight = useRef(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const refetch = useCallback(async () => {
    // Do not fetch for guests
    if (!isAuthenticated) {
      setFavorites([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await getFavorites()
      setFavorites(Array.isArray(data) ? data : [])
    } catch (err) {
      // Do not redirect here; let caller decide
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (autoLoad && isAuthenticated) {
      refetch()
    }
  }, [autoLoad, isAuthenticated, refetch])

  // Clear favorites when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([])
      setLoading(false)
    }
  }, [isAuthenticated])

  const isFavorite = useCallback((movieId) => {
    if (!movieId || !isAuthenticated) return false
    return favorites.some((m) => String(m?.id) === String(movieId))
  }, [favorites, isAuthenticated])

  const add = useCallback(async (movieId) => {
    if (!movieId || inflight.current) return
    if (!isAuthenticated) {
      // Only redirect when user explicitly tries to add
      navigate('/login')
      return
    }
    inflight.current = true
    // optimistic add if missing
    const existed = isFavorite(movieId)
    if (!existed) setFavorites((prev) => [...prev, { id: movieId }])
    try {
      await addFavorite(movieId)
      // sync with server to ensure full data (title, image, ...)
      refetch()
    } catch (err) {
      // revert
      if (!existed) setFavorites((prev) => prev.filter((m) => String(m.id) !== String(movieId)))
      // do not redirect here
      throw err
    } finally {
      inflight.current = false
    }
  }, [isAuthenticated, navigate, isFavorite, refetch])

  const remove = useCallback(async (movieId) => {
    if (!movieId || inflight.current) return
    if (!isAuthenticated) {
      // Only redirect when user explicitly tries to remove (from UI)
      navigate('/login')
      return
    }
    inflight.current = true
    // optimistic remove
    const before = favorites
    setFavorites((prev) => prev.filter((m) => String(m.id) !== String(movieId)))
    try {
      await removeFavorite(movieId)
      // sync with server
      refetch()
    } catch (err) {
      // revert
      setFavorites(before)
      // do not redirect here
      throw err
    } finally {
      inflight.current = false
    }
  }, [favorites, isAuthenticated, navigate, refetch])

  const toggle = useCallback(async (movieId) => {
    if (!movieId) return
    if (isFavorite(movieId)) return remove(movieId)
    return add(movieId)
  }, [add, remove, isFavorite])

  return useMemo(() => ({
    favorites,
    loading,
    error,
    refetch,
    isFavorite,
    addFavorite: add,
    removeFavorite: remove,
    toggleFavorite: toggle,
  }), [favorites, loading, error, refetch, isFavorite, add, remove, toggle])
}
