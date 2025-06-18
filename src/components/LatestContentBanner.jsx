import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LatestContentBanner() {
  const [latestContent, setLatestContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchLatestContent = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .in("category", ["Películas", "Series"])
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) {
        setLatestContent(data);
      }
    };

    fetchLatestContent();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === latestContent.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [latestContent.length]);

  if (latestContent.length === 0) return null;

  const currentContent = latestContent[currentIndex];

  return (
    <div className="relative w-full h-[45vh] md:h-[55vh] bg-black overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[280px] h-[300px] md:w-[400px] md:h-[450px] group">
          <img
            src={currentContent.thumbnail}
            alt={currentContent.title}
            className="w-full h-full object-cover rounded-lg shadow-2xl transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <div className="relative h-full flex flex-col">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hover:from-blue-400 hover:to-purple-500 transition-colors duration-300">LuemTv</h1>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm bg-red-600/80 hover:bg-red-700 text-white px-3 py-1.5 rounded transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-end pb-8 px-4 md:px-8 lg:px-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-500 transition-colors duration-300">
                {currentContent.category}
              </span>
              <span className="text-gray-300 text-xs">Nuevo</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 hover:text-blue-400 transition-colors duration-300">
              {currentContent.title}
            </h2>
            <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-4 max-w-xl">
              {currentContent.description}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = `/watch/${currentContent.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
              >
                <span>Ver ahora</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-all duration-300 text-sm font-medium hover:shadow-lg hover:shadow-white/10 hover:scale-105"
              >
                Más información
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {latestContent.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-blue-600 scale-125" 
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
