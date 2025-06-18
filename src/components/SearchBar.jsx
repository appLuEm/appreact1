export default function SearchBar({ searchQuery, setSearchQuery, onSearch }) {
  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Buscar por título..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        className="w-full p-2 rounded-md text-black"
      />
    </div>
  );
}
