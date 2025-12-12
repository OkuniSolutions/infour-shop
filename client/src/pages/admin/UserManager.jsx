import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'cliente',
    is_active: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await userService.getAll({ page, limit: 10, search: searchTerm });
      setUsers(response.data?.users || []);
      setPagination({
        page: response.data?.pagination?.currentPage || 1,
        totalPages: response.data?.pagination?.totalPages || 1
      });
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        is_active: user.is_active
      });
    } else {
      setEditingUser(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'cliente',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingUser) {
        await userService.update(editingUser.id, formData);
      }
      handleCloseModal();
      loadUsers(pagination.page);
    } catch (error) {
      alert(error.error || 'Error al guardar usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await userService.update(user.id, { is_active: !user.is_active });
      loadUsers(pagination.page);
    } catch (error) {
      alert(error.error || 'Error al cambiar estado');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers(1);
  };

  const getRoleBadge = (role) => {
    const config = {
      admin: { class: 'danger', icon: 'shield-fill' },
      editor: { class: 'warning', icon: 'pencil-fill' },
      cliente: { class: 'info', icon: 'person-fill' }
    };
    const c = config[role] || config.cliente;
    return (
      <span className={`badge bg-${c.class}`}>
        <i className={`bi bi-${c.icon} me-1`}></i>
        {role}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="user-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="bi bi-people me-2"></i>
          Gesti�n de Usuarios
        </h1>
      </div>

      {/* Search */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-3">
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-secondary w-100">
                <i className="bi bi-search me-2"></i>
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <Loading message="Cargando usuarios..." />
          ) : users.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Tel�fono</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Registro</th>
                    <th style={{ width: '100px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                          </div>
                          <div>
                            <strong>{user.first_name} {user.last_name}</strong>
                            <br />
                            <small className="text-muted">ID: {user.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone || '-'}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>
                        <span className={`badge ${user.is_active ? 'bg-success' : 'bg-secondary'}`}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleOpenModal(user)}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className={`btn btn-outline-${user.is_active ? 'warning' : 'success'}`}
                            onClick={() => handleToggleStatus(user)}
                            title={user.is_active ? 'Desactivar' : 'Activar'}
                          >
                            <i className={`bi bi-${user.is_active ? 'pause' : 'play'}`}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon="bi-people"
              title="No hay usuarios"
              message="No se encontraron usuarios con esos criterios"
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
                    <button className="page-link" onClick={() => loadUsers(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Usuario</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Apellido</label>
                      <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tel�fono</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label">Rol</label>
                      <select
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="cliente">Cliente</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Estado</label>
                      <div className="form-check form-switch mt-2">
                        <input
                          type="checkbox"
                          name="is_active"
                          className="form-check-input"
                          checked={formData.is_active}
                          onChange={handleChange}
                        />
                        <label className="form-check-label">
                          {formData.is_active ? 'Activo' : 'Inactivo'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;