import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const handleAddToCart = () => {
    addToCart(product);
    // Mostrar notificación (puedes usar react-toastify)
    alert('Producto agregado al carrito');
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    const result = await toggleWishlist(product.id);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.error);
    }
  };

  // URL de la imagen
  const imageUrl = product.image_url
    ? `http://localhost:3000${product.image_url}`
    : null;

  return (
    <div className="col">
      <div className="card product-card h-100 position-relative">
        {/* Botón wishlist */}
        {user && (
          <button
            className={`btn-wishlist ${isInWishlist(product.id) ? 'active' : ''}`}
            onClick={handleToggleWishlist}
          >
            <i className={`bi bi-heart${isInWishlist(product.id) ? '-fill' : ''}`}></i>
          </button>
        )}

        {/* Imagen del producto */}
        <Link to={`/products/${product.id}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              className="card-img-top product-image"
              alt={product.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="product-image-placeholder"
            style={{ display: imageUrl ? 'none' : 'flex' }}
          >
            <i className="bi bi-image"></i>
          </div>
        </Link>

        {/* Información del producto */}
        <div className="card-body d-flex flex-column">
          <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
            <h5 className="card-title">{product.name}</h5>
          </Link>
          
          {product.category && (
            <p className="text-muted small mb-2">
              <i className="bi bi-tag me-1"></i>
              {product.category.name}
            </p>
          )}

          <p className="card-text text-truncate" style={{ maxHeight: '3rem' }}>
            {product.description}
          </p>

          {/* Precio y stock */}
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="price-tag">${parseFloat(product.price).toFixed(2)}</span>
              <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
              </span>
            </div>

            {/* Botones de acción */}
            <div className="d-grid gap-2">
              {product.stock > 0 ? (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddToCart}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Agregar al Carrito
                  </button>
                  <Link
                    to={`/products/${product.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Ver Detalles
                  </Link>
                </>
              ) : (
                <button className="btn btn-secondary" disabled>
                  Agotado
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;