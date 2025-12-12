import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import salesService from '../../services/salesService';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });
  const [selectedSale, setSelectedSale] = useState(null);
  const [stats, setStats] = useState({ totalRevenue: 0, totalSales: 0 });

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        status: filters.status || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      };

      const response = await salesService.getAll(params);
      setSales(response.data?.sales || []);
      setPagination({
        page: response.data?.pagination?.currentPage || 1,
        totalPages: response.data?.pagination?.totalPages || 1,
        total: response.data?.pagination?.totalSales || 0
      });
      setStats({
        totalRevenue: response.data?.stats?.totalRevenue || 0,
        totalSales: response.data?.pagination?.totalSales || 0
      });
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    loadSales(1);
  };

  const handleStatusChange = async (saleId, newStatus) => {
    try {
      await salesService.updateStatus(saleId, newStatus);
      loadSales(pagination.page);
      if (selectedSale?.id === saleId) {
        setSelectedSale(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      alert(error.error || 'Error al actualizar estado');
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      pendiente: { class: 'warning', text: 'Pendiente' },
      completado: { class: 'success', text: 'Completado' },
      cancelado: { class: 'danger', text: 'Cancelado' }
    };
    const c = config[status] || config.pendiente;
    return <span className={`badge bg-${c.class}`}>{c.text}</span>;
  };

  return (
    <div className="sales-report">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="bi bi-graph-up me-2"></i>
          Reporte de Ventas
        </h1>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6 className="text-white-50">Ingresos Totales</h6>
              <h2 className="mb-0">{formatCurrency(stats.totalRevenue)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6 className="text-white-50">Total de Ventas</h6>
              <h2 className="mb-0">{stats.totalSales}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleApplyFilters} className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Estado</label>
              <select
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Desde</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Hasta</label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-filter me-2"></i>
                Filtrar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        {/* Sales List */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="mb-0">Ventas ({pagination.total})</h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <Loading message="Cargando ventas..." />
              ) : sales.length > 0 ? (
                <div className="list-group list-group-flush" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {sales.map(sale => (
                    <button
                      key={sale.id}
                      className={`list-group-item list-group-item-action ${selectedSale?.id === sale.id ? 'active' : ''}`}
                      onClick={() => setSelectedSale(sale)}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">Pedido #{sale.id}</h6>
                          <small className={selectedSale?.id === sale.id ? 'text-white-50' : 'text-muted'}>
                            {sale.user?.first_name} {sale.user?.last_name}
                          </small>
                        </div>
                        <div className="text-end">
                          {getStatusBadge(sale.status)}
                          <div className="mt-1">
                            <strong>{formatCurrency(sale.total)}</strong>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="bi-bag-x"
                  title="No hay ventas"
                  message="No se encontraron ventas con esos criterios"
                />
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="card-footer">
                <nav>
                  <ul className="pagination pagination-sm justify-content-center mb-0">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <li key={i} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => loadSales(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Sale Detail */}
        <div className="col-lg-6">
          {selectedSale ? (
            <div className="card">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Pedido #{selectedSale.id}</h5>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={selectedSale.status}
                  onChange={(e) => handleStatusChange(selectedSale.id, e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className="card-body">
                {/* Customer Info */}
                <div className="mb-4">
                  <h6 className="text-muted">
                    <i className="bi bi-person me-2"></i>
                    Cliente
                  </h6>
                  <p className="mb-1">
                    <strong>{selectedSale.user?.first_name} {selectedSale.user?.last_name}</strong>
                  </p>
                  <p className="mb-1 text-muted">{selectedSale.user?.email}</p>
                  {selectedSale.user?.phone && (
                    <p className="mb-0 text-muted">{selectedSale.user?.phone}</p>
                  )}
                </div>

                {/* Order Info */}
                <div className="mb-4">
                  <h6 className="text-muted">
                    <i className="bi bi-calendar me-2"></i>
                    Fecha del Pedido
                  </h6>
                  <p className="mb-0">{formatDate(selectedSale.createdAt)}</p>
                </div>

                {/* Shipping */}
                <div className="mb-4">
                  <h6 className="text-muted">
                    <i className="bi bi-geo-alt me-2"></i>
                    Direcci�n de Env�o
                  </h6>
                  <p className="mb-0">{selectedSale.shipping_address}</p>
                </div>

                {/* Products */}
                <div className="mb-4">
                  <h6 className="text-muted">
                    <i className="bi bi-box me-2"></i>
                    Productos
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th className="text-center">Cant.</th>
                          <th className="text-end">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSale.items?.map(item => (
                          <tr key={item.id}>
                            <td>{item.product?.name || `Producto #${item.product_id}`}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">{formatCurrency(item.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan="2" className="text-end">Total:</th>
                          <th className="text-end text-primary">
                            {formatCurrency(selectedSale.total)}
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
                <p className="text-muted mt-3">Selecciona una venta para ver los detalles</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;