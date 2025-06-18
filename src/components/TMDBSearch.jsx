// src/components/TMDBSearch.jsx
import { useState } from "react";
import axios from "axios";

export default function TMDBSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("movie"); // 'movie' o 'tv'
  const [error, setError] = useState(null);

  const search = async (pageNum = 1) => {
    if (!query) return;
    setLoading(true);
    try {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/${searchType}`,
        { 
          params: { 
            api_key: apiKey, 
            language: "es-ES", 
            query,
            page: pageNum
          } 
        }
      );
      setResults(data.results);
      setTotalPages(Math.min(data.total_pages, 5)); // Limitamos a 5 páginas para no sobrecargar
      setPage(pageNum);
    } catch (error) {
      console.error("Error searching TMDB:", error);
      setError("Error al buscar en TMDB. Por favor, inténtelo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      search(newPage);
    }
  };

  const handleTypeChange = (type) => {
    setSearchType(type);
    setPage(1);
    if (query) {
      search(1);
    }
  };

  const handleSearch = () => {
    if (query) {
      search(1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="relative">
        <input
            type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en TMDB..."
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
          Buscar
        </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm text-center py-2">{error}</div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium truncate">{item.title || item.name}</p>
                  <p className="text-xs text-gray-400">
                    {searchType === "movie" 
                      ? item.release_date?.split('-')[0]
                      : item.first_air_date?.split('-')[0]
                    }
                  </p>
                </div>
          </div>
        ))}
      </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
              className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-3 py-1">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || loading}
              className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
