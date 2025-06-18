import { useState } from 'react';
import MovieForm from './MovieForm';
import SeriesForm from './SeriesForm';

export default function ContentForm({ onClose }) {
  const [contentType, setContentType] = useState(null);

  if (contentType === 'movie') {
    return <MovieForm onClose={onClose} />;
  }

  if (contentType === 'series') {
    return <SeriesForm onClose={onClose} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Agregar Contenido</h2>
        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cerrar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setContentType('movie')}
          className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 flex flex-col items-center justify-center space-y-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <span className="text-xl font-semibold">Agregar Película</span>
        </button>

        <button
          onClick={() => setContentType('series')}
          className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 flex flex-col items-center justify-center space-y-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-xl font-semibold">Agregar Serie</span>
        </button>
      </div>
    </div>
  );
} 