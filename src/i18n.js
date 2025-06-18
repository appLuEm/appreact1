// src/i18n.js

const lang = navigator.language.startsWith("es") ? "es" : "en";

const translations = {
  es: {
    watchNow: "Ver ahora",
    searchPlaceholder: "Buscar por título...",
    recent: "Recientes",
    resultsFor: (q) => `Resultados para "${q}"`,
    see: "Ver",
  },
  en: {
    watchNow: "Watch now",
    searchPlaceholder: "Search by title...",
    recent: "Recent",
    resultsFor: (q) => `Results for "${q}"`,
    see: "Watch",
  },
};

const t = translations[lang];

export default t;
