import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPersonDetail } from '@/services/api';
import Skeleton from '@/components/ui/skeleton';
import BackButton from '@/components/common/BackButton';

const PersonDetail = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchPerson() {
      try {
        setLoading(true);
        const data = await getPersonDetail(id);
        if (!cancelled) setPerson(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load person');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) fetchPerson();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="relative h-[40vh] md:h-[50vh] w-full">
          <Skeleton className="absolute inset-0 w-full h-full" />
        </div>
        <div className="px-6 md:px-10 py-8">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="flex gap-4 overflow-x-auto pb-4">
            <Skeleton className="h-64 w-40" />
            <Skeleton className="h-64 w-40" />
            <Skeleton className="h-64 w-40" />
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-red-500">{error}</div>
    );
  }
  if (!person) return null;

  const {
    name,
    role,
    image,
    summary,
    birth_date,
    death_date,
    height,
    awards,
    known_for,
  } = person;

  const avatar = image || 'https://via.placeholder.com/300x450';
  const known = Array.isArray(known_for) ? known_for : [];

  return (
    <div className="min-h-screen ">
      {/* Banner header */}
      <div className="absolute top-4 left-4 z-20 mb-4">
        <BackButton className="bg-white/80 hover:bg-white text-slate-900 backdrop-blur" />
      </div>

      <div className="relative h-[40vh] md:h-[50vh] w-full bg-black">
        <img src={avatar} alt={name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 h-full flex items-end pb-8">
          <div className="flex items-end gap-6">
            <img src={avatar} alt={name} className="w-28 h-40 md:w-36 md:h-52 object-cover rounded-md shadow-lg" />
            <div>
              <h1 className="text-3xl text-white md:text-4xl font-bold">{name}</h1>
              {role && <p className="mt-2 text-gray-300">{role}</p>}

            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 text-left">
        {/* Summary */}
        {summary && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Biography</h2>
            <p className="text-black dark:text-white leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Personal info */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Personal Info</h2>
          <div className="flex gap-4">
            <div className="bg-white/5 rounded p-4">
              <p className="text-gray-400">Birth Date</p>
              <p className="font-medium">{birth_date || 'N/A'}</p>
            </div>
            <div className="bg-white/5 rounded p-4">
              <p className="text-gray-400">Death Date</p>
              <p className="font-medium">{death_date || '—'}</p>
            </div>
            <div className="bg-white/5 rounded p-4">
              <p className="text-gray-400">Height</p>
              <p className="font-medium">{height || 'N/A'}</p>
            </div>
            <div className="bg-white/5 rounded p-4">
              <p className="text-gray-400">Awards</p>
              <p className="font-medium">{awards || 'N/A'}</p>
            </div>
          </div>
        </section>

        {/* Known For */}
        {known.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Known For</h2>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {known.map((m) => (
                  <Link
                    key={m.id}
                    to={`/movie/${m.id}`}
                    className="group min-w-[160px] sm:min-w-[180px] md:min-w-[200px]"
                  >
                    <div className="relative rounded-md overflow-hidden bg-white/5">
                      <img src={m.image || 'https://via.placeholder.com/300x450'} alt={m.title}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-2">
                      <p className="font-medium truncate">{m.title}</p>
                      <p className="text-sm text-gray-300 mt-1">
                        {m.role ? m.role : ''}{m.character ? ` • ${m.character}` : ''}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PersonDetail;
