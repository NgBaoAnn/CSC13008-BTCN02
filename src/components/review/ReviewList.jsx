import React, { useEffect, useState } from "react"
import { getMovieReviews } from "@/services/api"
import { Badge } from "@/components/ui/badge"
import Pagination from "@/components/common/Pagination"
import ExpandableText from "@/components/common/Exandabletext"
import Skeleton from "@/components/ui/skeleton"

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest" },
  { value: "lowest", label: "Lowest" },
]

const ReviewList = ({ movieId, initialLimit = 5 }) => {
  const [reviews, setReviews] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_items: 0, page_size: initialLimit })
  const [sort, setSort] = useState("newest")
  const [loading, setLoading] = useState(false)

  const page = pagination.current_page

  useEffect(() => {
    let ignore = false
    async function fetchReviews() {
      setLoading(true)
      try {
        const { data, pagination } = await getMovieReviews(movieId, page, initialLimit, sort)
        if (!ignore) {
          setReviews(data)
          setPagination(pagination)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    if (movieId) fetchReviews()
    return () => { ignore = true }
  }, [movieId, page, sort, initialLimit])

  const canPrev = pagination.current_page > 1
  const canNext = pagination.current_page < pagination.total_pages

  const goPrev = () => {
    if (!canPrev) return
    setPagination((p) => ({ ...p, current_page: p.current_page - 1 }))
  }
  const goNext = () => {
    if (!canNext) return
    setPagination((p) => ({ ...p, current_page: p.current_page + 1 }))
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Reviews</h2>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 px-2 py-1"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading && (
        <ul className="space-y-4" aria-hidden>
          {Array.from({ length: Math.max(3, Math.min(5, pagination.page_size || initialLimit)) }).map((_, i) => (
            <li key={i} className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-2/3 mt-3" />
              <Skeleton className="h-3 w-full mt-2" />
              <Skeleton className="h-3 w-11/12 mt-1" />
              <Skeleton className="h-3 w-10/12 mt-1" />
            </li>
          ))}
        </ul>
      )}

      {!loading && reviews.length === 0 && (
        <div className="py-6 text-sm text-gray-600 dark:text-slate-400">No reviews available.</div>
      )}

      {!loading && reviews.length > 0 && (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-slate-100">{r.username}</span>
                  {typeof r.rate === 'number' && (
                    <Badge variant="secondary" className="text-xs">{r.rate.toFixed(1)}</Badge>
                  )}
                  {r.warning_spoilers && (
                    <Badge variant="destructive" className="text-xs">Spoilers</Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400">{new Date(r.date).toLocaleDateString()}</span>
              </div>
              {r.title && (
                <p className="mt-2 text-sm font-semibold text-gray-900 text-left dark:text-slate-100">{r.title}</p>
              )}
              {r.content && (
                <ExpandableText
                  text={r.content}
                  step={300}
                  className="mt-1 text-left leading-relaxed"
                  buttonClassName=""
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {!loading && pagination.total_pages > 1 && (
        <Pagination
          canPrev={canPrev}
          canNext={canNext}
          onPrev={goPrev}
          onNext={goNext}
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
        />
      )}
    </div>
  )
}

export default ReviewList
