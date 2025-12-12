import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      // Cargar productos y categor�as en paralelo
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAll({ limit: 8 }),
        categoryService.getAll()
      ]);

      setFeaturedProducts(productsRes.data?.products || []);
      setCategories(categoriesRes.data?.categories || []);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Cargando..." />;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">
                Bienvenido a InFour
              </h1>
              <p className="lead mb-4">
                Descubre los mejores productos al mejor precio.
                Calidad y servicio garantizados.
              </p>
              <div className="d-flex gap-3">
                <Link to="/products" className="btn btn-light btn-lg">
                  <i className="bi bi-grid me-2"></i>
                  Ver Productos
                </Link>
                <Link to="/categories" className="btn btn-outline-light btn-lg">
                  <i className="bi bi-tags me-2"></i>
                  Categor�as
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block text-center">
              <i className="bi bi-shop display-1"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Categor�as */}
      {categories.length > 0 && (
        <section className="categories-section mb-5">
          <div className="container">
            <h2 className="section-title mb-4">
              <i className="bi bi-tags me-2"></i>
              Categor�as
            </h2>
            <div className="row g-3">
              {categories.slice(0, 6).map(category => (
                <div key={category.id} className="col-6 col-md-4 col-lg-2">
                  <Link
                    to={`/products?category=${category.id}`}
                    className="card category-card text-decoration-none h-100"
                  >
                    <div className="card-body text-center">
                      <i className="bi bi-folder2 display-6 text-primary mb-2"></i>
                      <h6 className="card-title mb-0">{category.name}</h6>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Productos Destacados */}
      <section className="featured-products-section mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">
              <i className="bi bi-star me-2"></i>
              Productos Destacados
            </h2>
            <Link to="/products" className="btn btn-outline-primary">
              Ver todos <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {featuredProducts.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-1 text-muted"></i>
              <p className="text-muted mt-3">No hay productos disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="features-section bg-light py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
                <i className="bi bi-truck display-4 text-primary mb-3"></i>
                <h5>Env�o Gratis</h5>
                <p className="text-muted">En compras mayores a $500</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <i className="bi bi-shield-check display-4 text-primary mb-3"></i>
                <h5>Compra Segura</h5>
                <p className="text-muted">Protecci�n en cada compra</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <i className="bi bi-headset display-4 text-primary mb-3"></i>
                <h5>Soporte 24/7</h5>
                <p className="text-muted">Estamos para ayudarte</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;