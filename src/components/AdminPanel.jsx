// src/components/AdminPanel.jsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import SeriesForm from "./SeriesForm";
import ContentManager from "./ContentManager";
import UserManager from "./UserManager";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("series");
  const [series, setSeries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [showSeriesForm, setShowSeriesForm] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [showSeries, setShowSeries] = useState(false);

  useEffect(() => {
    if (activeTab === "series") fetchSeries();
  }, [activeTab]);

  async function fetchSeries() {
    const { data, error } = await supabase
      .from("series")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setSeries(data);
  }

  async function fetchEpisodes(seriesId) {
    setLoadingEpisodes(true);
    const { data, error } = await supabase
      .from("episodes")
      .select("*")
      .eq("series_id", seriesId)
      .order("season, episode", { ascending: true });
    setEpisodes(error ? [] : data);
    setLoadingEpisodes(false);
  }

  function handleSelectSeries(serie) {
    setSelectedSeries(serie);
    fetchEpisodes(serie.id);
  }

  function handleCloseForm() {
    setShowSeriesForm(false);
    fetchSeries();
  }

  // Agrupa episodios por temporada
  function groupBySeason(episodes) {
    const grouped = {};
    for (const ep of episodes) {
      if (!grouped[ep.season]) grouped[ep.season] = [];
      grouped[ep.season].push(ep);
    }
    return grouped;
  }

  async function handleVideoUrlChange(epId, value) {
    setEpisodes((eps) =>
      eps.map((ep) => (ep.id === epId ? { ...ep, video_url: value } : ep))
    );
    await supabase.from("episodes").update({ video_url: value }).eq("id", epId);
  }

  async function handleDeleteSeries(id) {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta serie?')) return;
    const { error } = await supabase.from('series').delete().eq('id', id);
    if (!error) fetchSeries();
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Panel de Administración</h1>
      <div className="max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("series")}
            className={`px-4 py-2 rounded-t-lg font-semibold transition-all duration-200 border-b-2 ${activeTab === "series" ? "border-blue-500 bg-gray-900" : "border-transparent bg-gray-800 hover:bg-gray-700"}`}
          >
            Series
          </button>
          <button
            onClick={() => setActiveTab("peliculas")}
            className={`px-4 py-2 rounded-t-lg font-semibold transition-all duration-200 border-b-2 ${activeTab === "peliculas" ? "border-blue-500 bg-gray-900" : "border-transparent bg-gray-800 hover:bg-gray-700"}`}
          >
            Películas
          </button>
          <button
            onClick={() => setActiveTab("usuarios")}
            className={`px-4 py-2 rounded-t-lg font-semibold transition-all duration-200 border-b-2 ${activeTab === "usuarios" ? "border-blue-500 bg-gray-900" : "border-transparent bg-gray-800 hover:bg-gray-700"}`}
          >
            Usuarios
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "series" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <input
                type="text"
                placeholder="Buscar serie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 rounded bg-gray-800 text-white w-full md:w-1/2"
              />
              <button
                onClick={() => setShowSeriesForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                + Agregar serie desde TMDB
              </button>
            </div>
            {/* Botón mostrar/ocultar series */}
            <div className="flex justify-end gap-2">
              {!showSeries && (
                <button
                  onClick={() => setShowSeries(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  Mostrar series
                </button>
              )}
              {showSeries && (
                <button
                  onClick={() => setShowSeries(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                >
                  Ocultar series
                </button>
              )}
            </div>
            {/* Lista de series */}
            {showSeries && (
              <div className="bg-gray-900 rounded-lg shadow divide-y divide-gray-800">
                {series
                  .filter((s) =>
                    s.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((s) => (
                    <div
                      key={s.id}
                      className={`p-4 flex items-center gap-4 justify-between hover:bg-gray-800 transition`}
                    >
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleSelectSeries(s)}>
                        {s.thumbnail && (
                          <img src={s.thumbnail} alt={s.title} className="w-12 h-16 object-cover rounded" />
                        )}
                        <div>
                          <h2 className="text-lg font-bold">{s.title}</h2>
                          <p className="text-gray-400 text-sm line-clamp-2">{s.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedSeries(s); setShowSeriesForm(true); }}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteSeries(s.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Formulario para agregar serie desde TMDB */}
            {showSeriesForm && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-gray-900 rounded-lg p-6 w-full max-w-5xl shadow-xl relative max-h-screen overflow-y-auto">
                  <SeriesForm onClose={handleCloseForm} />
                </div>
              </div>
            )}

            {/* Episodios de la serie seleccionada */}
            {selectedSeries && (
              <div className="bg-gray-900 rounded-lg shadow p-6 mt-4">
                <h2 className="text-xl font-bold mb-4">Episodios de {selectedSeries.title}</h2>
                {loadingEpisodes ? (
                  <div className="text-center py-8">Cargando episodios...</div>
                ) : episodes.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No hay episodios para esta serie.</div>
                ) : (
                  Object.entries(groupBySeason(episodes)).map(([season, eps]) => (
                    <div key={season} className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Temporada {season}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {eps.map((ep) => (
                          <div key={ep.id} className="bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow">
                            <div className="flex items-center gap-3">
                              {ep.thumbnail && (
                                <img src={ep.thumbnail} alt={ep.title} className="w-14 h-10 object-cover rounded" />
                              )}
                              <div>
                                <div className="font-semibold text-sm">Ep. {ep.episode}: {ep.title}</div>
                                <div className="text-xs text-gray-400 line-clamp-2">{ep.description}</div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 mt-2">
                              <label className="text-xs text-gray-300">URL de video</label>
                              <input
                                type="text"
                                value={ep.video_url || ""}
                                onChange={(e) => handleVideoUrlChange(ep.id, e.target.value)}
                                className="px-2 py-1 rounded bg-gray-700 text-white text-xs"
                                placeholder="Pega aquí la URL del video"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "peliculas" && (
          <div className="bg-gray-900 rounded-lg shadow p-6">
            <ContentManager />
          </div>
        )}

        {activeTab === "usuarios" && (
          <div className="bg-gray-900 rounded-lg shadow p-6">
            <UserManager />
          </div>
        )}
      </div>
    </div>
  );
}
