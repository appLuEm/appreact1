// src/components/TopNavBar.jsx
import { Home, Search, UserCircle } from "lucide-react";

export default function TopNavBar({ onFilterSelect, onSearchToggle }) {
  const buttons = ["Home", "TV", "Cine", "Series"];

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-black bg-opacity-60 backdrop-blur text-white sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <UserCircle className="w-6 h-6" />
        <Search className="w-6 h-6 cursor-pointer" onClick={onSearchToggle} />
        <Home className="w-6 h-6 cursor-pointer" onClick={() => onFilterSelect(null)} />
      </div>
      <nav className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
        {buttons.map((label) => (
          <button
            key={label}
            onClick={() => onFilterSelect(label === "Home" ? null : label)}
            className="bg-gray-800 hover:bg-gray-700 text-xs md:text-sm px-3 py-1 rounded-md whitespace-nowrap"
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
