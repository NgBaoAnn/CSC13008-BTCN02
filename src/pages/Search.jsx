import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import MovieCard from '@/components/movie/MovieCard';
import { searchMoviesByTitle } from '@/services/api';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import Skeleton from '@/components/ui/skeleton';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const title = (searchParams.get('title') || '').trim();
  const page = Number(searchParams.get('page') || '1');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_items: 0, page_size: 12 });

  useEffect(() => {
    let ignore = false;
    async function run() {
      if (!title) {
        setResults([]);
        setPagination({ current_page: 1, total_pages: 1, total_items: 0, page_size: 12 });
        return;
      }
      setLoading(true);
      try {
        const { data, pagination } = await searchMoviesByTitle(title, page, 12);
        if (!ignore) {
          setResults(data);
          setPagination(pagination);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => { ignore = true; };
  }, [title, page]);

  const canPrev = useMemo(() => pagination.current_page > 1, [pagination]);
  const canNext = useMemo(() => pagination.current_page < pagination.total_pages, [pagination]);

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(p));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="px-6 py-8">

      {loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </>
      )}

      {!loading && title && results.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-gray-700 dark:text-slate-200">No movies found.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((m) => (
            <Link key={m.id} to={`/movie/${m.id}`} className="block">
              <MovieCard
                title={m.title}
                image={m.image}
                rate={m.rate}
                year={m.year}
              />
            </Link>
          ))}
        </div>
      )}

      {!loading && pagination.total_pages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => canPrev && goToPage(pagination.current_page - 1)}
              aria-disabled={!canPrev}
              data-disabled={!canPrev}
            />
            <PaginationItem>
              <span className="px-3 text-sm">Page {pagination.current_page} of {pagination.total_pages}</span>
            </PaginationItem>
            <PaginationNext
              onClick={() => canNext && goToPage(pagination.current_page + 1)}
              aria-disabled={!canNext}
              data-disabled={!canNext}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Search;
