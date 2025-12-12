import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import productService from '../services/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getById(id);
      setProduct(response.data?.product);
    } catch (err) {
      setError('Producto no encontrado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert('Producto agregado al carrito');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleToggleWishlist = async () => {
    const result = await toggleWishlist(product.id);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.error);
    }
  };

  const handleQuantityChange = (value) => {
    const newQty = Math.max(1, Math.min(value, product.stock));
    setQuantity(newQty);
  };

  if (loading) return <Loading message="Cargando producto..." />;

  if (error) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
          <h2 className="mt-3">{error}</h2>
          <Link to="/products" className="btn btn-primary mt-3">
            Volver a Productos
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = product.image_url
    ? `http://localhost:3000${product.image_url}`
    : null;

  return (
    <div className="product-detail-page py-4">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products">Productos</Link>
            </li>
            {product.category && (
              <li className="breadcrumb-item">
                <Link to={`/products?category=${product.category.id}`}>
                  {product.category.name}
                </Link>
              </li>
            )}
            <li className="breadcrumb-item active">{product.name}</li>
          </ol>
        </nav>

        <div className="row">
          {/* Imagen */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body p-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="img-fluid rounded"
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light rounded"
                    style={{ height: '400px' }}
                  >
                    <i className="bi bi-image display-1 text-muted"></i>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informaci�n */}
          <div className="col-md-6">
            <div className="product-info">
              {/* Categor�a */}
              {product.category && (
                <Link
                  to={`/products?category=${product.category.id}`}
                  className="badge bg-primary mb-2 text-decoration-none"
                >
                  {product.category.name}
                </Link>
              )}

              {/* Nombre */}
              <h1 className="mb-3">{product.name}</h1>

              {/* Precio */}
              <div className="price-section mb-4">
                <span className="display-5 text-primary fw-bold">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              </div>

              {/* Stock */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <span className="badge bg-success fs-6">
                    <i className="bi bi-check-circle me-1"></i>
                    En stock ({product.stock} disponibles)
                  </span>
                ) : (
                  <span className="badge bg-danger fs-6">
                    <i className="bi bi-x-circle me-1"></i>
                    Agotado
                  </span>
                )}
              </div>

              {/* Descripci�n */}
              <div className="mb-4">
                <h5>Descripci�n</h5>
                <p className="text-muted">
                  {product.description || 'Sin descripci�n disponible'}
                </p>
              </div>

              {/* Cantidad y botones */}
              {product.stock > 0 && (
                <div className="purchase-section">
                  {/* Selector de cantidad */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">Cantidad</label>
                    <div className="input-group" style={{ maxWidth: '150px' }}>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        min="1"
                        max={product.stock}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>

                  {/* Botones de acci�n */}
                  <div className="d-flex gap-3 mb-4">
                    <button
                      className="btn btn-primary btn-lg flex-grow-1"
                      onClick={handleAddToCart}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      Agregar al Carrito
                    </button>
                    <button
                      className="btn btn-success btn-lg flex-grow-1"
                      onClick={handleBuyNow}
                    >
                      <i className="bi bi-bag-check me-2"></i>
                      Comprar Ahora
                    </button>
                  </div>

                  {/* Wishlist */}
                  {user && (
                    <button
                      className={`btn btn-outline-danger w-100 ${isInWishlist(product.id) ? 'active' : ''}`}
                      onClick={handleToggleWishlist}
                    >
                      <i className={`bi bi-heart${isInWishlist(product.id) ? '-fill' : ''} me-2`}></i>
                      {isInWishlist(product.id) ? 'En tu Lista de Deseos' : 'Agregar a Lista de Deseos'}
                    </button>
                  )}
                </div>
              )}

              {/* Info adicional */}
              <div className="mt-4 pt-4 border-top">
                <div className="row g-3">
                  <div className="col-4 text-center">
                    <i className="bi bi-truck display-6 text-primary"></i>
                    <p className="small mb-0 mt-2">Env�o r�pido</p>
                  </div>
                  <div className="col-4 text-center">
                    <i className="bi bi-shield-check display-6 text-primary"></i>
                    <p className="small mb-0 mt-2">Compra segura</p>
                  </div>
                  <div className="col-4 text-center">
                    <i className="bi bi-arrow-return-left display-6 text-primary"></i>
                    <p className="small mb-0 mt-2">Devoluciones</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;