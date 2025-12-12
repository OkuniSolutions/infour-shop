import { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data?.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      handleCloseModal();
      loadCategories();
    } catch (error) {
      alert(error.error || 'Error al guardar categoría');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría? Los productos asociados perderán su categoría.')) return;

    try {
      await categoryService.delete(id);
      loadCategories();
    } catch (error) {
      alert(error.error || 'Error al eliminar categoría');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="category-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="bi bi-tags me-2"></i>
          Gestión de Categorías
        </h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-lg me-2"></i>
          Nueva Categoría
        </button>
      </div>

      {/* Categories Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <Loading message="Cargando categorías..." />
          ) : categories.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Productos</th>
                    <th>Creada</th>
                    <th style={{ width: '100px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>
                        <strong>{category.name}</strong>
                      </td>
                      <td className="text-muted">
                        {category.description || '-'}
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {category.products?.length || 0}
                        </span>
                      </td>
                      <td>{formatDate(category.createdAt)}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleOpenModal(category)}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(category.id)}
                            title="Eliminar"
                          >
                            <i className="bi bi-trash"></i>
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
              icon="bi-tags"
              title="No hay categorías"
              message="Crea tu primera categoría para organizar los productos"
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nombre de la categoría"
                      required
                    />
                  </div>

                  <div className="mb-0">
                    <label className="form-label">Descripción</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Descripción opcional..."
                    />
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

export default CategoryManager;