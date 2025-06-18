import { useState, useEffect } from 'react';
import { supabase } from '../lib';

export default function PeliculasForm({ initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    video_url: '',
    category: 'Películas',
    type: 'movie'
  });
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [showMovies, setShowMovies] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.overview,
        thumbnail: initialData.poster_path ? `https://image.tmdb.org/t/p/w500${initialData.poster_path}` : '',
        video_url: '',
        category: 'Películas',
        type: 'movie'
      });
    }
  }, [initialData]);

  async function fetchMovies() {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('category', 'Películas')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert([formData])
        .select()
        .single();
      if (error) throw error;
      setFormData({
        title: '',
        description: '',
        thumbnail: '',
        video_url: '',
        category: 'Películas',
        type: 'movie'
      });
      if (showMovies) fetchMovies();
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Error al agregar la película');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta película?')) return;
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);
      if (error) throw error;
      if (showMovies) fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Error al eliminar la película');
    }
  }

  return (
    <div className="space-y-6">
      {/* Formulario de nueva película */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Agregar Nueva Película</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Categoría
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
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
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                URL de la Miniatura
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Agregando...' : 'Agregar Película'}
          </button>
        </form>
      </div>

      {/* Botón para mostrar/ocultar películas */}
      <div className="flex justify-end gap-2">
        {!showMovies && (
          <button
            onClick={() => { setShowMovies(true); fetchMovies(); }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            Mostrar películas
          </button>
        )}
        {showMovies && (
          <button
            onClick={() => setShowMovies(false)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
          >
            Ocultar películas
          </button>
        )}
      </div>

      {/* Lista de películas */}
      {showMovies && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Películas Existentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map((item) => (
              <div
                key={item.id}
                className="bg-gray-700 rounded-lg overflow-hidden"
              >
                <div className="aspect-video relative">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-medium text-lg">{item.title}</h3>
                    <p className="text-gray-300 text-sm">{item.category}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-300 text-sm line-clamp-2 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        setFormData({
                          title: item.title,
                          description: item.description,
                          thumbnail: item.thumbnail,
                          video_url: item.video_url,
                          category: item.category,
                          type: 'movie'
                        });
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 