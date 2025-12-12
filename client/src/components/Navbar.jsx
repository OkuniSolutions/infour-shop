import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <i className="bi bi-shop me-2"></i>
          E-commerce
        </Link>

        {/* Toggle para móvil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Productos
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-orders">
                  Mis Pedidos
                </Link>
              </li>
            )}
          </ul>

          {/* Barra de búsqueda */}
          <form className="d-flex me-3" onSubmit={(e) => {
            e.preventDefault();
            const query = e.target.search.value;
            if (query.trim()) {
              navigate(`/search?q=${query}`);
            }
          }}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar productos..."
              name="search"
            />
            <button className="btn btn-light" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          {/* Iconos y usuario */}
          <ul className="navbar-nav">
            {/* Wishlist */}
            {user && (
              <li className="nav-item">
                <Link className="nav-link position-relative" to="/wishlist">
                  <i className="bi bi-heart fs-5"></i>
                  {wishlist.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {/* Carrito */}
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart">
                <i className="bi bi-cart fs-5"></i>
                {getTotalItems() > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </li>

            {/* Usuario */}
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span className="ms-2">{user.first_name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i>
                      Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/my-orders">
                      <i className="bi bi-bag me-2"></i>
                      Mis Pedidos
                    </Link>
                  </li>
                  {(user.role === 'admin' || user.role === 'content_creator') && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item" to="/admin">
                          <i className="bi bi-speedometer2 me-2"></i>
                          Panel Admin
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light ms-2" to="/register">
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;