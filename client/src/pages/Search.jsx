import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import searchService from '../services/searchService';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const response = await searchService.search(query);
      setResults(response.data?.products || []);
      setSearched(true);
    } catch (error) {
      console.error('Error en b�squeda:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (!query) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="bi-search"
          title="Buscar productos"
          message="Usa la barra de b�squeda para encontrar lo que necesitas"
          actionText="Ver Productos"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="search-page py-4">
      <div className="container">
        <div className="mb-4">
          <h1>
            <i className="bi bi-search me-2"></i>
            Resultados de b�squeda
          </h1>
          <p className="text-muted">
            {loading ? 'Buscando...' : `${results.length} resultados para "${query}"`}
          </p>
        </div>

        {loading ? (
          <Loading message="Buscando productos..." />
        ) : results.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : searched ? (
          <EmptyState
            icon="bi-emoji-frown"
            title="No se encontraron resultados"
            message={`No hay productos que coincidan con "${query}"`}
            actionText="Ver todos los productos"
            actionLink="/products"
          />
        ) : null}
      </div>
    </div>
  );
};

export default Search;