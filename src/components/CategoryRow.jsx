// src/components/CategoryRow.jsx
import React, { useRef } from "react";

export default function CategoryRow({ title, videos, onItemSelect, onItemDoubleClick }) {
  const scrollContainer = useRef(null);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-500 transition-colors duration-300">
          {title}
        </h2>
      </div>
      
      <div className="relative group">
        <div 
          ref={scrollContainer}
          className="flex gap-2 md:gap-3 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video) => (
            <div
              key={video.id}
              className="relative flex-none w-[120px] md:w-[140px] group/item cursor-pointer rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 bg-gray-900/80"
              onClick={() => {
                if (video.category === 'Series') {
                  window.location.href = `/series/${video.id}`;
                } else {
                  window.location.href = `/watch/${video.id}`;
                }
              }}
              onDoubleClick={() => onItemDoubleClick(video)}
            >
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden transition-all duration-300 group-hover/item:scale-105 group-hover/item:shadow-2xl group-hover/item:shadow-blue-500/20">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover/item:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-xs font-medium line-clamp-2">{video.title}</h3>
                  <p className="text-gray-300 text-[10px] mt-1 line-clamp-2">{video.description}</p>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-white text-xs font-medium line-clamp-1 group-hover/item:text-blue-400 transition-colors duration-300">{video.title}</h3>
                <p className="text-gray-400 text-[10px] mt-1 line-clamp-1">{video.category}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollContainer.current?.scrollBy({ left: -400, behavior: 'smooth' })}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/80 hover:bg-black text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:shadow-lg hover:shadow-white/10"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => scrollContainer.current?.scrollBy({ left: 400, behavior: 'smooth' })}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/80 hover:bg-black text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:shadow-lg hover:shadow-white/10"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
