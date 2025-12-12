import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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

    // Validar contrase�as
    if (formData.password !== formData.confirmPassword) {
      setError('Las contrase�as no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contrase�a debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <i className="bi bi-person-plus display-4 text-primary"></i>
                  <h2 className="mt-2">Crear Cuenta</h2>
                  <p className="text-muted">Reg�strate para comenzar</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="first_name" className="form-label">
                        Nombre
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="last_name" className="form-label">
                        Apellido
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Tu apellido"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo Electr�nico
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="correo@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Tel�fono (opcional)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-phone"></i>
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="1234567890"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">
                        Contrase�a
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="M�nimo 6 caracteres"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirmar Contrase�a
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock-fill"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Repite tu contrase�a"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Registrando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Crear Cuenta
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="mb-0">
                    �Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-primary text-decoration-none">
                      Inicia sesi�n
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;