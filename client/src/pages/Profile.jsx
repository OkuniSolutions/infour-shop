import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import Loading from '../components/Loading';

const Profile = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      await userService.updateProfile(formData);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (error) {
      setMessage({ type: 'danger', text: error.error || 'Error al actualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'danger', text: 'Las contraseñas no coinciden' });
      return;
    }

    if (passwordData.new_password.length < 6) {
      setMessage({ type: 'danger', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setLoading(true);

    try {
      await userService.changePassword({
        currentPassword: passwordData.current_password,
        newPassword: passwordData.new_password
      });
      setMessage({ type: 'success', text: 'Contraseña cambiada correctamente' });
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      setMessage({ type: 'danger', text: error.error || 'Error al cambiar contraseña' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="profile-page py-4">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle bg-primary text-white mx-auto mb-3">
                  <span className="display-6">
                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                  </span>
                </div>
                <h5>{user.first_name} {user.last_name}</h5>
                <p className="text-muted small">{user.email}</p>
                <span className="badge bg-primary">{user.role}</span>
              </div>
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person me-2"></i>
                  Mi Perfil
                </button>
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  <i className="bi bi-lock me-2"></i>
                  Cambiar Contraseña
                </button>
                <Link to="/my-orders" className="list-group-item list-group-item-action">
                  <i className="bi bi-bag me-2"></i>
                  Mis Pedidos
                </Link>
                <Link to="/wishlist" className="list-group-item list-group-item-action">
                  <i className="bi bi-heart me-2"></i>
                  Lista de Deseos
                </Link>
                <button
                  className="list-group-item list-group-item-action text-danger"
                  onClick={logout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="col-lg-9">
            {message.text && (
              <div className={`alert alert-${message.type} alert-dismissible fade show`}>
                {message.text}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMessage({ type: '', text: '' })}
                ></button>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="card">
                <div className="card-header bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-person me-2"></i>
                    Información Personal
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleProfileSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
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
                      <div className="col-md-6 mb-3">
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

                    <div className="mb-4">
                      <label className="form-label">Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="card">
                <div className="card-header bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-lock me-2"></i>
                    Cambiar Contraseña
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Contraseña Actual</label>
                      <input
                        type="password"
                        name="current_password"
                        className="form-control"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Nueva Contraseña</label>
                      <input
                        type="password"
                        name="new_password"
                        className="form-control"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Confirmar Nueva Contraseña</label>
                      <input
                        type="password"
                        name="confirm_password"
                        className="form-control"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Cambiando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-lock me-2"></i>
                          Cambiar Contraseña
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;