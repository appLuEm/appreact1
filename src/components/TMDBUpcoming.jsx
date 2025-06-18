import { useState, useEffect, useRef } from "react";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function TMDBUpcoming() {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const moviesScrollRef = useRef(null);
  const tvShowsScrollRef = useRef(null);

  useEffect(() => {
    fetchTMDBContent();
  }, []);

  async function fetchTMDBContent() {
    try {
      setLoading(true);
      const [moviesRes, tvRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=es-ES`),
        fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${TMDB_API_KEY}&language=es-ES`)
      ]);

      const moviesData = await moviesRes.json();
      const tvData = await tvRes.json();

      setUpcomingMovies(moviesData.results || []);
      setTvShows(tvData.results || []);
    } catch (error) {
      console.error('Error fetching TMDB content:', error);
    } finally {
      setLoading(false);
    }
  }

  function scrollLeft(ref) {
    if (ref.current) {
      ref.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
    }
  }

  function scrollRight(ref) {
    if (ref.current) {
      ref.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-48 bg-gray-800 rounded"></div>
        <div className="h-48 bg-gray-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <section className="mb-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-200">Próximos estrenos</h2>
        </div>
        <div className="relative">
          <button
            onClick={() => scrollLeft(moviesScrollRef)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <div
            ref={moviesScrollRef}
            className="flex gap-2 md:gap-3 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {upcomingMovies.map((movie) => (
              <div
                key={movie.id}
                className="relative flex-none w-[120px] md:w-[140px] group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-xs font-medium line-clamp-2">{movie.title}</h3>
                    <p className="text-gray-300 text-[10px] mt-1 line-clamp-2">{movie.overview}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-white text-xs font-medium line-clamp-1 group-hover:text-blue-400 transition-colors duration-300">{movie.title}</h3>
                  <p className="text-gray-400 text-[10px] mt-1">{new Date(movie.release_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollRight(moviesScrollRef)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </section>

      <section className="mb-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-200">Series en emisión</h2>
        </div>
        <div className="relative">
          <button
            onClick={() => scrollLeft(tvShowsScrollRef)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <div
            ref={tvShowsScrollRef}
            className="flex gap-2 md:gap-3 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tvShows.map((show) => (
              <div
                key={show.id}
                className="relative flex-none w-[120px] md:w-[140px] group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-xs font-medium line-clamp-2">{show.name}</h3>
                    <p className="text-gray-300 text-[10px] mt-1 line-clamp-2">{show.overview}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-white text-xs font-medium line-clamp-1 group-hover:text-blue-400 transition-colors duration-300">{show.name}</h3>
                  <p className="text-gray-400 text-[10px] mt-1">{new Date(show.first_air_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollRight(tvShowsScrollRef)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
