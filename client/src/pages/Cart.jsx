import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';

const Cart = () => {
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user } = useAuth();

  const total = getTotalPrice();
  const itemCount = getTotalItems();

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="bi-cart-x"
          title="Tu carrito est� vac�o"
          message="Agrega productos para comenzar tu compra"
          actionText="Ver Productos"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="cart-page py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>
            <i className="bi bi-cart3 me-2"></i>
            Mi Carrito
          </h1>
          <button
            className="btn btn-outline-danger"
            onClick={clearCart}
          >
            <i className="bi bi-trash me-2"></i>
            Vaciar Carrito
          </button>
        </div>

        <div className="row">
          {/* Lista de productos */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  Productos ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {cart.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="col-lg-4">
            <div className="card sticky-top" style={{ top: '100px' }}>
              <div className="card-header bg-white">
                <h5 className="mb-0">Resumen del Pedido</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Env�o:</span>
                  <span className={total >= 500 ? 'text-success' : ''}>
                    {total >= 500 ? 'Gratis' : '$50.00'}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="text-primary fs-4">
                    ${(total >= 500 ? total : total + 50).toFixed(2)}
                  </strong>
                </div>

                {total < 500 && (
                  <div className="alert alert-info py-2 mb-3">
                    <small>
                      <i className="bi bi-info-circle me-1"></i>
                      Agrega ${(500 - total).toFixed(2)} m�s para env�o gratis
                    </small>
                  </div>
                )}

                {user ? (
                  <Link
                    to="/checkout"
                    className="btn btn-primary btn-lg w-100"
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Proceder al Pago
                  </Link>
                ) : (
                  <div>
                    <Link
                      to="/login"
                      state={{ from: { pathname: '/checkout' } }}
                      className="btn btn-primary btn-lg w-100"
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Iniciar Sesi�n para Comprar
                    </Link>
                    <p className="text-muted text-center mt-2 mb-0">
                      <small>
                        �No tienes cuenta?{' '}
                        <Link to="/register">Reg�strate</Link>
                      </small>
                    </p>
                  </div>
                )}
              </div>
              <div className="card-footer bg-white">
                <Link
                  to="/products"
                  className="btn btn-outline-secondary w-100"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;