import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  // Filtros desde URL
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data?.categories || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: searchParams.get('page') || 1,
        limit: 12,
        category_id: searchParams.get('category') || undefined,
        minPrice: searchParams.get('minPrice') || undefined,
        maxPrice: searchParams.get('maxPrice') || undefined,
        sort: searchParams.get('sort') || 'newest'
      };

      // Limpiar undefined
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const response = await productService.getAll(params);
      setProducts(response.data?.products || []);
      setPagination({
        page: response.data?.pagination?.currentPage || 1,
        totalPages: response.data?.pagination?.totalPages || 1,
        total: response.data?.pagination?.totalProducts || 0
      });
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sort) params.set('sort', filters.sort);
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    });
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="products-page py-4">
      <div className="container">
        <div className="row">
          {/* Sidebar de filtros */}
          <div className="col-lg-3 mb-4">
            <div className="card">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-funnel me-2"></i>
                  Filtros
                </h5>
                <button
                  className="btn btn-sm btn-link text-danger"
                  onClick={clearFilters}
                >
                  Limpiar
                </button>
              </div>
              <div className="card-body">
                {/* Categoría */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Categoría</label>
                  <select
                    name="category"
                    className="form-select"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rango de precio */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Precio</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="number"
                        name="minPrice"
                        className="form-control"
                        placeholder="Mín"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        min="0"
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        name="maxPrice"
                        className="form-control"
                        placeholder="Máx"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Ordenar */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Ordenar por</label>
                  <select
                    name="sort"
                    className="form-select"
                    value={filters.sort}
                    onChange={handleFilterChange}
                  >
                    <option value="newest">Más recientes</option>
                    <option value="oldest">Más antiguos</option>
                    <option value="price_asc">Precio: menor a mayor</option>
                    <option value="price_desc">Precio: mayor a menor</option>
                    <option value="name_asc">Nombre: A-Z</option>
                    <option value="name_desc">Nombre: Z-A</option>
                  </select>
                </div>

                <button
                  className="btn btn-primary w-100"
                  onClick={applyFilters}
                >
                  <i className="bi bi-search me-2"></i>
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 mb-0">
                <i className="bi bi-grid me-2"></i>
                Productos
              </h1>
              <span className="text-muted">
                {pagination.total} productos encontrados
              </span>
            </div>

            {loading ? (
              <Loading message="Cargando productos..." />
            ) : products.length > 0 ? (
              <>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Paginación */}
                {pagination.totalPages > 1 && (
                  <nav className="mt-5">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                        >
                          <i className="bi bi-chevron-left"></i>
                        </button>
                      </li>

                      {[...Array(pagination.totalPages)].map((_, index) => (
                        <li
                          key={index + 1}
                          className={`page-item ${pagination.page === index + 1 ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}

                      <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            ) : (
              <EmptyState
                icon="bi-search"
                title="No se encontraron productos"
                message="Intenta con otros filtros de búsqueda"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;