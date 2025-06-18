import { useState, useEffect } from 'react';
import { supabase } from '../lib';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function EpisodesForm({ seriesId, onClose }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tmdbId, setTmdbId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEpisodes();
    fetchSeriesTMDBId();
  }, [seriesId]);

  async function fetchSeriesTMDBId() {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('tmdb_id')
        .eq('id', seriesId)
        .single();

      if (error) throw error;
      if (data) setTmdbId(data.tmdb_id);
    } catch (error) {
      console.error('Error fetching series TMDB ID:', error);
    }
  }

  async function fetchEpisodes() {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('series_id', seriesId)
        .order('season_number', { ascending: true })
        .order('episode_number', { ascending: true });

      if (error) throw error;
      setEpisodes(data || []);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  }

  async function preloadEpisodesFromTMDB() {
    try {
      setLoading(true);
      const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=es-ES`);
      const serie = await res.json();
      const seasons = serie.seasons.filter(s => s.season_number > 0);

      let episodios = [];
      for (const season of seasons) {
        const resSeason = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${season.season_number}?api_key=${TMDB_API_KEY}&language=es-ES`);
        const dataSeason = await resSeason.json();
        if (dataSeason.episodes) {
          episodios = episodios.concat(
            dataSeason.episodes.map(ep => ({
              series_id: seriesId,
              season_number: season.season_number,
              episode_number: ep.episode_number,
              title: ep.name,
              description: ep.overview,
              thumbnail: ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : '',
              video_url: '',
              duration: ep.runtime || null,
              tmdb_id: ep.id
            }))
          );
        }
      }
      setEpisodes(episodios);
    } catch (error) {
      console.error('Error preloading episodes:', error);
      alert('Error al precargar episodios de TMDB');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAll() {
    try {
      setLoading(true);
      // Primero eliminar episodios existentes
      const { error: deleteError } = await supabase
        .from('episodes')
        .delete()
        .eq('series_id', seriesId);

      if (deleteError) throw deleteError;

      // Luego insertar todos los episodios
      const { error: insertError } = await supabase
        .from('episodes')
        .insert(episodes);

      if (insertError) throw insertError;

      alert('Episodios guardados correctamente');
      fetchEpisodes();
    } catch (error) {
      console.error('Error saving episodes:', error);
      alert('Error al guardar los episodios');
    } finally {
      setLoading(false);
    }
  }

  function handleEpisodeChange(index, field, value) {
    const newEpisodes = [...episodes];
    newEpisodes[index] = {
      ...newEpisodes[index],
      [field]: value
    };
    setEpisodes(newEpisodes);
  }

  const filteredEpisodes = episodes.filter(episode =>
    episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `T${episode.season_number}E${episode.episode_number}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Gestionar Episodios</h2>
        <div className="flex space-x-4">
          {tmdbId && (
            <button
              onClick={preloadEpisodesFromTMDB}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Precargar desde TMDB'}
            </button>
          )}
          <button
            onClick={handleSaveAll}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Todo'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar episodios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        {filteredEpisodes.map((episode, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={episode.title}
                  onChange={(e) => handleEpisodeChange(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Temporada
                  </label>
                  <input
                    type="number"
                    value={episode.season_number}
                    onChange={(e) => handleEpisodeChange(index, 'season_number', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Episodio
                  </label>
                  <input
                    type="number"
                    value={episode.episode_number}
                    onChange={(e) => handleEpisodeChange(index, 'episode_number', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                value={episode.description}
                onChange={(e) => handleEpisodeChange(index, 'description', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  URL del Video
                </label>
                <input
                  type="url"
                  value={episode.video_url}
                  onChange={(e) => handleEpisodeChange(index, 'video_url', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  URL de la Miniatura
                </label>
                <input
                  type="url"
                  value={episode.thumbnail}
                  onChange={(e) => handleEpisodeChange(index, 'thumbnail', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Duración (minutos)
              </label>
              <input
                type="number"
                value={episode.duration}
                onChange={(e) => handleEpisodeChange(index, 'duration', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 