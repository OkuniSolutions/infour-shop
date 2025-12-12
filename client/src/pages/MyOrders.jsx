import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import salesService from '../services/salesService';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await salesService.getMyOrders();
      setOrders(response.data?.sales || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendiente: { class: 'warning', text: 'Pendiente', icon: 'clock' },
      completado: { class: 'success', text: 'Completado', icon: 'check-circle' },
      cancelado: { class: 'danger', text: 'Cancelado', icon: 'x-circle' }
    };
    const config = statusConfig[status] || statusConfig.pendiente;
    return (
      <span className={`badge bg-${config.class}`}>
        <i className={`bi bi-${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="bi-bag"
          title="Inicia sesión para ver tus pedidos"
          message="Accede a tu cuenta para ver el historial de compras"
          actionText="Iniciar Sesión"
          actionLink="/login"
        />
      </div>
    );
  }

  if (loading) return <Loading message="Cargando tus pedidos..." />;

  return (
    <div className="my-orders-page py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>
            <i className="bi bi-bag me-2"></i>
            Mis Pedidos
          </h1>
          <Link to="/profile" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Volver al Perfil
          </Link>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon="bi-bag-x"
            title="No tienes pedidos"
            message="Cuando realices una compra, aparecerá aquí"
            actionText="Ir a Comprar"
            actionLink="/products"
          />
        ) : (
          <div className="row">
            {/* Lista de pedidos */}
            <div className="col-lg-5 mb-4">
              <div className="card">
                <div className="card-header bg-white">
                  <h5 className="mb-0">Historial ({orders.length})</h5>
                </div>
                <div className="list-group list-group-flush" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {orders.map(order => (
                    <button
                      key={order.id}
                      className={`list-group-item list-group-item-action ${selectedOrder?.id === order.id ? 'active' : ''}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">Pedido #{order.id}</h6>
                          <small className={selectedOrder?.id === order.id ? 'text-white-50' : 'text-muted'}>
                            {formatDate(order.createdAt)}
                          </small>
                        </div>
                        <div className="text-end">
                          <div className="mb-1">{getStatusBadge(order.status)}</div>
                          <strong>${parseFloat(order.total).toFixed(2)}</strong>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Detalle del pedido */}
            <div className="col-lg-7">
              {selectedOrder ? (
                <div className="card">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Pedido #{selectedOrder.id}</h5>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div className="card-body">
                    {/* Información del pedido */}
                    <div className="mb-4">
                      <h6 className="text-muted mb-3">Información del Pedido</h6>
                      <div className="row">
                        <div className="col-6">
                          <p className="mb-1"><strong>Fecha:</strong></p>
                          <p className="text-muted">{formatDate(selectedOrder.createdAt)}</p>
                        </div>
                        <div className="col-6">
                          <p className="mb-1"><strong>Total:</strong></p>
                          <p className="text-primary fs-5">${parseFloat(selectedOrder.total).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dirección de envío */}
                    <div className="mb-4">
                      <h6 className="text-muted mb-3">
                        <i className="bi bi-geo-alt me-2"></i>
                        Dirección de Envío
                      </h6>
                      <p className="mb-0">{selectedOrder.shipping_address}</p>
                    </div>

                    {/* Productos */}
                    <div>
                      <h6 className="text-muted mb-3">
                        <i className="bi bi-box me-2"></i>
                        Productos ({selectedOrder.items?.length || 0})
                      </h6>
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th className="text-center">Cant.</th>
                              <th className="text-end">Precio</th>
                              <th className="text-end">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items?.map(item => (
                              <tr key={item.id}>
                                <td>
                                  <Link to={`/products/${item.product_id}`}>
                                    {item.product?.name || `Producto #${item.product_id}`}
                                  </Link>
                                </td>
                                <td className="text-center">{item.quantity}</td>
                                <td className="text-end">${parseFloat(item.price).toFixed(2)}</td>
                                <td className="text-end">${parseFloat(item.subtotal).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th colSpan="3" className="text-end">Total:</th>
                              <th className="text-end text-primary">
                                ${parseFloat(selectedOrder.total).toFixed(2)}
                              </th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="bi bi-hand-index display-4 text-muted"></i>
                    <p className="text-muted mt-3">Selecciona un pedido para ver los detalles</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;