import './SearchBar.css';

export default function SearchBar({ placeholder = 'Search...', value, onChange, onSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch?.()}
        className="search-input"
      />
      <button type="button" onClick={onSearch} className="search-button" title="Search">
        🔍
      </button>
    </div>
  );
}
