import { useState, useEffect } from "react";
import { supabase } from "../lib";
import CategoryRow from "./CategoryRow";
import TMDBUpcoming from "./TMDBUpcoming";
import { useNavigate } from "react-router-dom";

export default function StreamingApp() {
  const [series, setSeries] = useState([]);
  const [peliculas, setPeliculas] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [bannerItems, setBannerItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContent();
    checkUser();
  }, []);

  useEffect(() => {
    // Mezclar solo series y películas para el banner (excluye TV)
    const all = [...series, ...peliculas];
    const shuffled = all.sort(() => Math.random() - 0.5);
    setBannerItems(shuffled);
  }, [series, peliculas]);

  useEffect(() => {
    if (bannerItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % bannerItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerItems]);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  async function fetchContent() {
    setLoading(true);
    try {
      // Series
      const { data: seriesData } = await supabase
        .from("series")
        .select("*")
        .order("created_at", { ascending: false });
      // Películas
      const { data: pelisData } = await supabase
        .from("videos")
        .select("*")
        .eq("category", "Películas")
        .order("created_at", { ascending: false });
      // TV
      const { data: tvData } = await supabase
        .from("videos")
        .select("*")
        .eq("category", "TV")
        .order("created_at", { ascending: false });
      setSeries(seriesData || []);
      setPeliculas(pelisData || []);
      setTvShows(tvData || []);
    } catch (error) {
      console.error("Error in fetchContent:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
        </div>
      </div>
    );
  }

  const currentBannerItem = bannerItems[currentBannerIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative pt-4">
        {currentBannerItem && (
          <div className="relative">
            {/* Banner de fondo extendido a pantalla completa */}
            <div className="absolute inset-0 h-[calc(25vh+2rem)] md:h-[calc(35vh+2rem)] lg:h-[calc(45vh+2rem)]">
              <img
                src={currentBannerItem.thumbnail}
                alt={currentBannerItem.title}
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800/20 to-transparent"></div>
            </div>
            {/* Navbar extendido a los costados */}
            <div className="absolute top-2 left-0 right-0 px-4 md:px-8 flex justify-between items-center z-20">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <h1 className="text-sm md:text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  LuemTv
                </h1>
              </div>
              {user && (
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-xs text-gray-300 bg-black/20 px-1.5 md:px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-1.5 md:px-2 py-0.5 rounded-full text-xs hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Salir
                  </button>
                </div>
              )}
            </div>
            {/* Contenido del banner centrado */}
            <div className="relative z-10 container mx-auto px-4">
              <div className="relative aspect-[16/9] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto group rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                <img
                  src={currentBannerItem.thumbnail}
                  alt={currentBannerItem.title}
                  className="w-full h-full object-cover rounded-2xl shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-2xl" />
                {/* Indicadores de banner */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {bannerItems.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                        index === currentBannerIndex 
                          ? 'bg-blue-500' 
                          : 'bg-gray-500/50'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className="px-1.5 md:px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                        {currentBannerItem.category || 'Serie'}
                      </span>
                      <h1 className="text-xs md:text-sm font-bold line-clamp-1 text-white">
                        {currentBannerItem.title}
                      </h1>
                    </div>
                    <p className="text-gray-300 text-xs line-clamp-1">
                      {currentBannerItem.description}
                    </p>
                    <button
                      onClick={() => {
                        if ((currentBannerItem.category || '').toLowerCase() === 'series') {
                          window.location.href = `/series/${currentBannerItem.id}`;
                        } else if ((currentBannerItem.category || '').toLowerCase() === 'tv') {
                          window.location.href = `/tv/${currentBannerItem.id}`;
                        } else {
                          window.location.href = `/watch/${currentBannerItem.id}`;
                        }
                      }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-1 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Ver ahora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Contenido */}
      <div className="container mx-auto px-4 -mt-8">
        {/* Películas */}
        <div className="mt-8">
          <CategoryRow title="Películas" videos={peliculas} />
        </div>
        {/* Series */}
        <CategoryRow title="Series" videos={series} />
        {/* TV */}
        <CategoryRow title="TV" videos={tvShows} />
        {/* Próximos estrenos de TMDB al final */}
        <div className="mt-0">
          <TMDBUpcoming />
        </div>
      </div>
    </div>
  );
}
