import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const searchData = [
  { title: 'Live prices of gold & silver', path: '/live-prices', keywords: 'gold silver price live rates market' },
  { title: 'Graphs & Statistics', path: '/market', keywords: 'graphs statistics charts data trends analysis' },
  { title: 'Customize your design', path: '/customize', keywords: 'customize design jewelry custom ornaments' },
  { title: 'Gold Ornaments', path: '/shop', keywords: 'gold ornaments jewelry pieces collection' },
  { title: 'Investment Guidance', path: '/#contact', keywords: 'investment advice guidance expert strategy' },
  { title: 'Custom Jewelry Design', path: '/customize', keywords: 'custom jewelry design bespoke crafted' },
  { title: 'Market Analytics', path: '/market', keywords: 'market analytics trends analysis statistics' },
  { title: 'Contact Us', path: '/#contact', keywords: 'contact email phone support customer service' },
  { title: 'About Our Services', path: '/#contact', keywords: 'about services quality assurance' },
];

function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i}>{part}</mark> : part
  );
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = (q) => {
    const lower = q.toLowerCase().trim();
    if (!lower) { setResults([]); setOpen(false); return; }
    const found = searchData.filter(
      (item) => item.title.toLowerCase().includes(lower) || item.keywords.toLowerCase().includes(lower)
    );
    setResults(found);
    setOpen(true);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    search(e.target.value);
  };

  const handleSelect = (path) => {
    setQuery('');
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="search-container" ref={ref}>
      <input
        type="text"
        id="searchInput"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && results[0] && handleSelect(results[0].path)}
        aria-label="Search"
      />
      <button
        id="searchBtn"
        aria-label="Search"
        onClick={() => search(query)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
      </button>

      {open && (
        <div className="search-results">
          {results.length === 0 ? (
            <div className="no-results">No results found for "{query}"</div>
          ) : (
            results.map((item, i) => (
              <button key={i} className="search-result-item" onClick={() => handleSelect(item.path)}>
                <div className="result-title">{highlight(item.title, query)}</div>
                <div className="result-url">{item.path}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
