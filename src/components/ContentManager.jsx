import { useState } from "react";
import TMDBSearch from "./TMDBSearch";
import PeliculasForm from "./PeliculasForm";

export default function ContentManager() {
  const [selectedTMDB, setSelectedTMDB] = useState(null);
  const [activeTab, setActiveTab] = useState('tmdb'); // 'tmdb', 'peliculas'

  function handleSelectContent(item) {
    setSelectedTMDB(item);
    setActiveTab('peliculas');
  }

  return (
    <div className="space-y-6">
      {/* Tabs de navegación */}
      <div className="flex space-x-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('tmdb')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'tmdb'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Buscar en TMDB
        </button>
        <button
          onClick={() => setActiveTab('peliculas')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'peliculas'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Películas
        </button>
      </div>

      {/* Contenido según tab activo */}
      {activeTab === 'tmdb' && (
        <TMDBSearch onSelect={handleSelectContent} />
      )}

      {activeTab === 'peliculas' && (
        <PeliculasForm onClose={() => setActiveTab('tmdb')} />
      )}
    </div>
  );
}
