import { useState } from 'react';
import { supabase } from '../lib';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function SeriesForm({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    video_url: ''
  });
  const [message, setMessage] = useState(null);

  async function searchTMDB() {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al buscar en TMDB' });
    } finally {
      setLoading(false);
    }
  }

  async function selectSeries(series) {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${series.id}?api_key=${TMDB_API_KEY}&language=es-ES`
      );
      const details = await res.json();
      setSelectedSeries(series);
      setFormData({
        title: details.name,
        description: details.overview,
        thumbnail: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '',
        video_url: ''
      });
      setSearchResults([]);
      setSearchTerm('');
      setEpisodes([]);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cargar detalles de la serie' });
    } finally {
      setLoading(false);
    }
  }

  // Agrupa episodios por temporada
  function groupBySeason(episodes) {
    const grouped = {};
    for (const ep of episodes) {
      if (!grouped[ep.season_number]) grouped[ep.season_number] = [];
      grouped[ep.season_number].push(ep);
    }
    return grouped;
  }

  async function preloadEpisodes(keepUrls = false) {
    if (!selectedSeries) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${selectedSeries.id}?api_key=${TMDB_API_KEY}&language=es-ES`);
      const serie = await res.json();
      const seasons = serie.seasons.filter(s => s.season_number > 0);
      let episodios = [];
      for (const season of seasons) {
        const resSeason = await fetch(`https://api.themoviedb.org/3/tv/${selectedSeries.id}/season/${season.season_number}?api_key=${TMDB_API_KEY}&language=es-ES`);
        const dataSeason = await resSeason.json();
        if (dataSeason.episodes) {
          episodios = episodios.concat(
            dataSeason.episodes.map(ep => {
              // Si keepUrls, intenta mantener la URL ya ingresada
              let prev = episodes.find(e => e.season_number === season.season_number && e.episode_number === ep.episode_number);
              return {
                season_number: season.season_number,
                episode_number: ep.episode_number,
                title: ep.name,
                description: ep.overview || '',
                thumbnail: ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : '',
                video_url: keepUrls && prev ? prev.video_url : '',
                duration: ep.runtime || 0
              };
            })
          );
        }
      }
      setEpisodes(episodios);
      setMessage({ type: 'success', text: 'Episodios cargados correctamente.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al precargar episodios de TMDB' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    if (episodes.length === 0) {
      setMessage({ type: 'error', text: 'Por favor, carga los episodios antes de guardar' });
      return;
    }
    const hasAtLeastOneVideoUrl = episodes.some(ep => ep.video_url.trim() !== '');
    if (!hasAtLeastOneVideoUrl) {
      setMessage({ type: 'error', text: 'Agrega al menos la URL de un episodio antes de guardar' });
      return;
    }
    try {
      setLoading(true);
      // 1. Guardar la serie en la tabla series
      const { data: savedSeries, error: seriesError } = await supabase
        .from('series')
        .insert([{
          title: formData.title,
          description: formData.description,
          thumbnail: formData.thumbnail,
          category: 'Series'
        }])
        .select()
        .single();
      if (seriesError) throw new Error(`Error al guardar la serie: ${seriesError.message}`);
      if (!savedSeries) throw new Error('No se recibió respuesta al guardar la serie');
      // 2. Guardar episodios
      const episodesToSave = episodes.map(ep => ({
        series_id: savedSeries.id,
        season: ep.season_number,
        episode: ep.episode_number,
        title: ep.title,
        description: ep.description || '',
        thumbnail: ep.thumbnail || '',
        video_url: ep.video_url,
        duration: ep.duration || 0
      }));
      if (episodesToSave.length > 0) {
        const { error: episodesError } = await supabase
          .from('episodes')
          .insert(episodesToSave);
        if (episodesError) throw new Error(`Error al guardar los episodios: ${episodesError.message}`);
      }
      setMessage({ type: 'success', text: 'Serie y episodios guardados correctamente.' });
      setTimeout(() => onClose(), 1200);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al guardar la serie y los episodios' });
    } finally {
      setLoading(false);
    }
  }

  function handleEpisodeChange(season, epNumber, field, value) {
    setEpisodes(eps => eps.map(ep =>
      ep.season_number === season && ep.episode_number === epNumber
        ? { ...ep, [field]: value }
        : ep
    ));
  }

  return (
    <div className="space-y-6 max-w-5xl w-full mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Agregar Serie</h2>
        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cerrar
        </button>
      </div>
      {message && (
        <div className={`rounded px-4 py-2 mb-2 text-sm ${message.type === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>{message.text}</div>
      )}
      <div className="space-y-2">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar serie en TMDB..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
            {searchResults.map((series) => (
              <div
                key={series.id}
                onClick={() => selectSeries(series)}
                className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700"
              >
                <div className="flex gap-4">
                  {series.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${series.poster_path}`}
                      alt={series.name}
                      className="w-20 h-30 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-white font-semibold">{series.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(series.first_air_date).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedSeries && (
          <form onSubmit={handleSubmit} className="space-y-2">
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
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => preloadEpisodes(false)}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Cargando episodios...' : 'Cargar Episodios desde TMDB'}
              </button>
              {episodes.length > 0 && (
                <button
                  type="button"
                  onClick={() => preloadEpisodes(true)}
                  disabled={loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  Actualizar info desde TMDB (mantener URLs)
                </button>
              )}
            </div>
            {loading && <div className="text-center py-2 text-blue-400">Cargando...</div>}
            {episodes.length > 0 && (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                <h3 className="text-lg font-semibold text-white">Episodios ({episodes.length})</h3>
                {Object.entries(groupBySeason(episodes)).map(([season, eps]) => (
                  <div key={season} className="mb-2">
                    <h4 className="text-blue-400 font-bold mb-1">Temporada {season}</h4>
                    <div className="space-y-2">
                      {eps.map((episode) => (
                        <div key={episode.episode_number} className="bg-gray-800 rounded-lg p-2">
                          <div className="mb-1">
                            <h5 className="text-white font-medium text-xs">
                              Ep. {episode.episode_number}: {episode.title}
                            </h5>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-0.5">
                              URL del Video
                            </label>
                            <input
                              type="url"
                              value={episode.video_url}
                              onChange={(e) => handleEpisodeChange(episode.season_number, episode.episode_number, 'video_url', e.target.value)}
                              className="w-full px-2 py-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-sm text-gray-400">
              * Agrega al menos la URL de un episodio para guardar
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Episodios'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}