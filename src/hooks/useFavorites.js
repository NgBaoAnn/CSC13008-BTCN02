import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addFavorite, getFavorites, removeFavorite } from '../services/api'

/**
 * Favorites state manager with optimistic updates
 */
export default function useFavorites({ autoLoad = true } = {}) {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(Boolean(autoLoad))
  const [error, setError] = useState(null)
  const navigating401 = useRef(false)
  const inflight = useRef(false)
  const navigate = useNavigate()

  const handle401 = useCallback((err) => {
    if (err?.status === 401 && !navigating401.current) {
      navigating401.current = true
      navigate('/login', { replace: true })
    }
  }, [navigate])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getFavorites()
      setFavorites(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err)
      handle401(err)
    } finally {
      setLoading(false)
    }
  }, [handle401])

  useEffect(() => {
    if (autoLoad) {
      refetch()
    }
  }, [autoLoad, refetch])

  const isFavorite = useCallback((movieId) => {
    if (!movieId) return false
    return favorites.some((m) => String(m?.id) === String(movieId))
  }, [favorites])

  const add = useCallback(async (movieId) => {
    if (!movieId || inflight.current) return
    inflight.current = true
    // optimistic add if missing
    const existed = isFavorite(movieId)
    if (!existed) setFavorites((prev) => [...prev, { id: movieId }])
    try {
      await addFavorite(movieId)
    } catch (err) {
      // revert
      if (!existed) setFavorites((prev) => prev.filter((m) => String(m.id) !== String(movieId)))
      handle401(err)
      throw err
    } finally {
      inflight.current = false
    }
  }, [handle401, isFavorite])

  const remove = useCallback(async (movieId) => {
    if (!movieId || inflight.current) return
    inflight.current = true
    // optimistic remove
    const before = favorites
    setFavorites((prev) => prev.filter((m) => String(m.id) !== String(movieId)))
    try {
      await removeFavorite(movieId)
    } catch (err) {
      // revert
      setFavorites(before)
      handle401(err)
      throw err
    } finally {
      inflight.current = false
    }
  }, [favorites, handle401])

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
