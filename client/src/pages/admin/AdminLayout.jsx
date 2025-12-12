import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;

  // Verificar que sea admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { path: '/admin', icon: 'speedometer2', label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: 'box', label: 'Productos' },
    { path: '/admin/categories', icon: 'tags', label: 'Categorías' },
    { path: '/admin/users', icon: 'people', label: 'Usuarios' },
    { path: '/admin/sales', icon: 'graph-up', label: 'Ventas' }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 px-0 bg-dark min-vh-100 position-fixed">
            <div className="d-flex flex-column h-100">
              {/* Brand */}
              <div className="p-3 border-bottom border-secondary">
                <Link to="/admin" className="text-white text-decoration-none">
                  <h5 className="mb-0">
                    <i className="bi bi-gear-fill me-2"></i>
                    Admin Panel
                  </h5>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-grow-1 p-3">
                <ul className="nav nav-pills flex-column">
                  {menuItems.map(item => (
                    <li key={item.path} className="nav-item mb-1">
                      <Link
                        to={item.path}
                        className={`nav-link text-white ${isActive(item.path, item.exact) ? 'active bg-primary' : ''}`}
                      >
                        <i className={`bi bi-${item.icon} me-2`}></i>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <hr className="text-secondary my-4" />

                <ul className="nav nav-pills flex-column">
                  <li className="nav-item">
                    <Link to="/" className="nav-link text-white-50">
                      <i className="bi bi-house me-2"></i>
                      Volver a la tienda
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link text-white-50 w-100 text-start"
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </nav>

              {/* User Info */}
              <div className="p-3 border-top border-secondary">
                <div className="d-flex align-items-center text-white">
                  <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '35px', height: '35px' }}>
                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                  </div>
                  <div>
                    <small className="d-block">{user.first_name} {user.last_name}</small>
                    <small className="text-white-50">{user.role}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10 ms-auto px-4 py-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;