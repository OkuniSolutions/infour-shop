import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const imageUrl = item.image_url
    ? `http://localhost:3000${item.image_url}`
    : null;

  const subtotal = parseFloat(item.price) * item.quantity;

  return (
    <div className="cart-item">
      <div className="row align-items-center">
        {/* Imagen */}
        <div className="col-md-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.name}
              className="img-fluid rounded"
              style={{ maxHeight: '80px', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="bg-secondary rounded d-flex align-items-center justify-content-center"
              style={{ height: '80px' }}
            >
              <i className="bi bi-image text-white fs-3"></i>
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="col-md-4">
          <h6 className="mb-1">{item.name}</h6>
          <p className="text-muted small mb-0">${parseFloat(item.price).toFixed(2)} c/u</p>
        </div>

        {/* Cantidad */}
        <div className="col-md-3">
          <div className="input-group input-group-sm">
            <button
              className="btn btn-outline-secondary"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <i className="bi bi-dash"></i>
            </button>
            <input
              type="number"
              className="form-control text-center"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              min="1"
              max={item.stock}
            />
            <button
              className="btn btn-outline-secondary"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.stock}
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
          <small className="text-muted">Disponibles: {item.stock}</small>
        </div>

        {/* Subtotal */}
        <div className="col-md-2 text-end">
          <h6 className="mb-0">${subtotal.toFixed(2)}</h6>
        </div>

        {/* Eliminar */}
        <div className="col-md-1 text-end">
          <button
            className="btn btn-sm btn-danger"
            onClick={() => removeFromCart(item.id)}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;