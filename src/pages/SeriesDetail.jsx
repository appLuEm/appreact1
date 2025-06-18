import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib';

export default function SeriesDetail() {
  const { id: rawId } = useParams();
  const id = rawId?.split(":")[0];
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);

  useEffect(() => {
    async function fetchSeriesData() {
      try {
        // Obtener datos de la serie
        const { data: seriesData, error: seriesError } = await supabase
          .from('series')
          .select('*')
          .eq('id', id)
          .single();

        if (seriesError) throw seriesError;
        setSeries(seriesData);

        // Obtener capítulos de la serie
        const { data: episodesData, error: episodesError } = await supabase
          .from('episodes')
          .select('*')
          .eq('series_id', id)
          .order('season', { ascending: true })
          .order('episode', { ascending: true });

        if (episodesError) throw episodesError;
        setEpisodes(episodesData);

        // Si hay capítulos, establecer la primera temporada como seleccionada
        if (episodesData && episodesData.length > 0) {
          setSelectedSeason(episodesData[0].season);
        }
      } catch (error) {
        console.error('Error fetching series data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSeriesData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-2xl">Serie no encontrada</h1>
      </div>
    );
  }

  // Obtener temporadas únicas
  const seasons = [...new Set(episodes.map(ep => ep.season))].sort((a, b) => a - b);
  
  // Filtrar capítulos por temporada seleccionada
  const currentSeasonEpisodes = episodes.filter(ep => ep.season === selectedSeason);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Banner de la serie */}
      <div className="relative h-[20vh] bg-black">
        <div className="absolute inset-0">
          <img
            src={series.thumbnail}
            alt={series.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="relative h-full flex flex-col justify-center p-4">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{series.title}</h1>
            <p className="text-gray-300 text-sm mb-3 max-w-xl line-clamp-2">{series.description}</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {series.category}
              </span>
              <span className="text-gray-300 text-xs">{episodes.length} Episodios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de temporadas */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {seasons.map(season => (
            <button
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                selectedSeason === season
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Temporada {season}
            </button>
          ))}
        </div>

        {/* Lista de capítulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSeasonEpisodes.map((episode) => (
            <div
              key={episode.id}
              className="bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group"
              onClick={() => window.location.href = `/watch/${episode.id}`}
            >
              <div className="relative aspect-video">
                <img
                  src={episode.thumbnail || series.thumbnail}
                  alt={episode.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">Episodio {episode.episode}</h3>
                    {episode.duration && (
                      <span className="text-gray-300 text-sm">
                        {Math.floor(episode.duration / 60)}:{(episode.duration % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2">{episode.title}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm line-clamp-2">{episode.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 