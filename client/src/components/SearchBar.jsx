import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="search-bar my-4">
      <form onSubmit={handleSubmit}>
        <div className="input-group input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            <i className="bi bi-search me-2"></i>
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;