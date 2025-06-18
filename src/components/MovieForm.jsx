import { useState } from 'react';
import { supabase } from '../lib';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function MovieForm({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    video_url: '',
    duration: '',
    tmdb_id: '',
    type: 'movie'
  });

  async function searchTMDB() {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching TMDB:', error);
      alert('Error al buscar en TMDB');
    } finally {
      setLoading(false);
    }
  }

  async function selectMovie(movie) {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=es-ES`
      );
      const details = await res.json();

      setSelectedMovie(movie);
      setFormData({
        title: details.title,
        description: details.overview,
        thumbnail: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '',
        video_url: '',
        duration: details.runtime,
        tmdb_id: details.id,
        type: 'movie'
      });
      setSearchResults([]);
      setSearchTerm('');
    } catch (error) {
      console.error('Error fetching movie details:', error);
      alert('Error al cargar detalles de la película');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('videos')
        .insert([formData]);

      if (error) throw error;
      alert('Película guardada correctamente');
      onClose();
    } catch (error) {
      console.error('Error saving movie:', error);
      alert('Error al guardar la película');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Agregar Película</h2>
        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cerrar
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar película en TMDB..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={searchTMDB}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((movie) => (
              <div
                key={movie.id}
                onClick={() => selectMovie(movie)}
                className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700"
              >
                <div className="flex gap-4">
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      className="w-20 h-30 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-white font-semibold">{movie.title}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMovie && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                URL del Video
              </label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Duración (minutos)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Película'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 