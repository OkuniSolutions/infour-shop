import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import salesService from '../services/salesService';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    shipping_address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: user?.phone || '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = getTotalPrice();
  const shipping = total >= 500 ? 0 : 50;
  const finalTotal = total + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Preparar datos de la venta
      const saleData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: `${formData.shipping_address}, ${formData.city}, ${formData.state} ${formData.zip_code}`,
        notes: formData.notes
      };

      const response = await salesService.create(saleData);

      if (response.success) {
        clearCart();
        navigate('/order-success', {
          state: {
            orderId: response.data?.sale?.id,
            total: finalTotal
          }
        });
      }
    } catch (err) {
      setError(err.error || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-cart-x display-1 text-muted"></i>
        <h2 className="mt-3">No hay productos en el carrito</h2>
        <Link to="/products" className="btn btn-primary mt-3">
          Ir a Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page py-4">
      <div className="container">
        <h1 className="mb-4">
          <i className="bi bi-credit-card me-2"></i>
          Finalizar Compra
        </h1>

        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        <div className="row">
          {/* Formulario */}
          <div className="col-lg-8">
            <form onSubmit={handleSubmit}>
              {/* Informaci�n de env�o */}
              <div className="card mb-4">
                <div className="card-header bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-geo-alt me-2"></i>
                    Direcci�n de Env�o
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Direcci�n</label>
                    <input
                      type="text"
                      name="shipping_address"
                      className="form-control"
                      value={formData.shipping_address}
                      onChange={handleChange}
                      placeholder="Calle, n�mero, colonia"
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Ciudad</label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Estado</label>
                      <input
                        type="text"
                        name="state"
                        className="form-control"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">C�digo Postal</label>
                      <input
                        type="text"
                        name="zip_code"
                        className="form-control"
                        value={formData.zip_code}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tel�fono de contacto</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10 d�gitos"
                      required
                    />
                  </div>

                  <div className="mb-0">
                    <label className="form-label">Notas del pedido (opcional)</label>
                    <textarea
                      name="notes"
                      className="form-control"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Instrucciones especiales de entrega..."
                    />
                  </div>
                </div>
              </div>

              {/* M�todo de pago */}
              <div className="card mb-4">
                <div className="card-header bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-wallet2 me-2"></i>
                    M�todo de Pago
                  </h5>
                </div>
                <div className="card-body">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="cash"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="cash">
                      <i className="bi bi-cash me-2"></i>
                      Pago contra entrega
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="transfer"
                    />
                    <label className="form-check-label" htmlFor="transfer">
                      <i className="bi bi-bank me-2"></i>
                      Transferencia bancaria
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success btn-lg w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Confirmar Pedido (${finalTotal.toFixed(2)})
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Resumen */}
          <div className="col-lg-4">
            <div className="card sticky-top" style={{ top: '100px' }}>
              <div className="card-header bg-white">
                <h5 className="mb-0">Resumen del Pedido</h5>
              </div>
              <div className="card-body">
                {/* Lista de productos */}
                <div className="order-items mb-3">
                  {cart.map(item => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                      <span className="text-muted">
                        {item.name} x{item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Env�o:</span>
                  <span className={shipping === 0 ? 'text-success' : ''}>
                    {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-primary fs-4">
                    ${finalTotal.toFixed(2)}
                  </strong>
                </div>
              </div>
              <div className="card-footer bg-white">
                <Link to="/cart" className="btn btn-outline-secondary w-100">
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver al Carrito
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;