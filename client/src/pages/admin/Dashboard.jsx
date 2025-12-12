import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import salesService from '../../services/salesService';
import userService from '../../services/userService';
import Loading from '../../components/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    sales: 0,
    users: 0,
    revenue: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [productsRes, categoriesRes, salesRes, usersRes] = await Promise.all([
        productService.getAll({ limit: 1 }),
        categoryService.getAll(),
        salesService.getAll({ limit: 5 }),
        userService.getAll({ limit: 1 })
      ]);

      setStats({
        products: productsRes.data?.pagination?.totalProducts || 0,
        categories: categoriesRes.data?.categories?.length || 0,
        sales: salesRes.data?.pagination?.totalSales || 0,
        users: usersRes.data?.pagination?.totalUsers || 0,
        revenue: salesRes.data?.stats?.totalRevenue || 0
      });

      setRecentSales(salesRes.data?.sales || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Loading message="Cargando panel de administraci�n..." />;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Panel de Administraci�n</h1>
          <p className="text-muted mb-0">Bienvenido, {user?.first_name}</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/products/new" className="btn btn-primary">
            <i className="bi bi-plus-lg me-2"></i>
            Nuevo Producto
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-white-50">Productos</h6>
                  <h2 className="mb-0">{stats.products}</h2>
                </div>
                <i className="bi bi-box display-6 opacity-50"></i>
              </div>
            </div>
            <Link to="/admin/products" className="card-footer bg-transparent text-white text-decoration-none d-flex justify-content-between">
              <span>Ver productos</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-white-50">Ventas</h6>
                  <h2 className="mb-0">{stats.sales}</h2>
                </div>
                <i className="bi bi-bag-check display-6 opacity-50"></i>
              </div>
            </div>
            <Link to="/admin/sales" className="card-footer bg-transparent text-white text-decoration-none d-flex justify-content-between">
              <span>Ver ventas</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-white-50">Usuarios</h6>
                  <h2 className="mb-0">{stats.users}</h2>
                </div>
                <i className="bi bi-people display-6 opacity-50"></i>
              </div>
            </div>
            <Link to="/admin/users" className="card-footer bg-transparent text-white text-decoration-none d-flex justify-content-between">
              <span>Ver usuarios</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="opacity-75">Categor�as</h6>
                  <h2 className="mb-0">{stats.categories}</h2>
                </div>
                <i className="bi bi-tags display-6 opacity-50"></i>
              </div>
            </div>
            <Link to="/admin/categories" className="card-footer bg-transparent text-dark text-decoration-none d-flex justify-content-between">
              <span>Ver categor�as</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Sales */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Ventas Recientes</h5>
              <Link to="/admin/sales" className="btn btn-sm btn-outline-primary">
                Ver todas
              </Link>
            </div>
            <div className="card-body p-0">
              {recentSales.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map(sale => (
                        <tr key={sale.id}>
                          <td>#{sale.id}</td>
                          <td>{sale.user?.first_name} {sale.user?.last_name}</td>
                          <td>{formatDate(sale.createdAt)}</td>
                          <td>{formatCurrency(sale.total)}</td>
                          <td>
                            <span className={`badge bg-${
                              sale.status === 'completado' ? 'success' :
                              sale.status === 'cancelado' ? 'danger' : 'warning'
                            }`}>
                              {sale.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-4 text-muted"></i>
                  <p className="text-muted mt-2">No hay ventas recientes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Acciones R�pidas</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-3">
                <Link to="/admin/products/new" className="btn btn-outline-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Agregar Producto
                </Link>
                <Link to="/admin/categories/new" className="btn btn-outline-success">
                  <i className="bi bi-folder-plus me-2"></i>
                  Nueva Categor�a
                </Link>
                <Link to="/admin/sales" className="btn btn-outline-info">
                  <i className="bi bi-graph-up me-2"></i>
                  Reportes de Ventas
                </Link>
                <Link to="/admin/users" className="btn btn-outline-secondary">
                  <i className="bi bi-person-gear me-2"></i>
                  Gestionar Usuarios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;