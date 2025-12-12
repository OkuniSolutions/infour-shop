import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const Wishlist = () => {
  const { wishlist, loading, loadWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="bi-heart"
          title="Inicia sesi�n para ver tu lista de deseos"
          message="Guarda tus productos favoritos para comprarlos despu�s"
          actionText="Iniciar Sesi�n"
          actionLink="/login"
        />
      </div>
    );
  }

  if (loading) return <Loading message="Cargando tu lista de deseos..." />;

  return (
    <div className="wishlist-page py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>
            <i className="bi bi-heart me-2"></i>
            Mi Lista de Deseos
          </h1>
          <span className="badge bg-primary fs-6">
            {wishlist.length} {wishlist.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState
            icon="bi-heart"
            title="Tu lista de deseos est� vac�a"
            message="Agrega productos que te gusten para guardarlos aqu�"
            actionText="Explorar Productos"
            actionLink="/products"
          />
        ) : (
          <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {wishlist.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-5">
              <Link to="/products" className="btn btn-outline-primary">
                <i className="bi bi-grid me-2"></i>
                Ver m�s productos
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;