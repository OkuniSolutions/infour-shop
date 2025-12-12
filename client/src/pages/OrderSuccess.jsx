import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, total } = location.state || {};

  return (
    <div className="order-success-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            <div className="card shadow">
              <div className="card-body p-5">
                <div className="success-icon mb-4">
                  <i className="bi bi-check-circle-fill text-success display-1"></i>
                </div>

                <h1 className="mb-3">¡Pedido Confirmado!</h1>
                <p className="lead text-muted mb-4">
                  Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
                </p>

                {orderId && (
                  <div className="order-info bg-light rounded p-4 mb-4">
                    <h5 className="mb-3">Detalles del Pedido</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Número de pedido:</span>
                      <strong>#{orderId}</strong>
                    </div>
                    {total && (
                      <div className="d-flex justify-content-between">
                        <span>Total:</span>
                        <strong className="text-primary">${total.toFixed(2)}</strong>
                      </div>
                    )}
                  </div>
                )}

                <div className="alert alert-info">
                  <i className="bi bi-envelope me-2"></i>
                  Te enviaremos un correo con los detalles de tu pedido.
                </div>

                <div className="d-grid gap-3 mt-4">
                  <Link to="/my-orders" className="btn btn-primary btn-lg">
                    <i className="bi bi-bag me-2"></i>
                    Ver Mis Pedidos
                  </Link>
                  <Link to="/products" className="btn btn-outline-primary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Seguir Comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;