import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    is_active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data?.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        category_id: filters.category || undefined,
        search: filters.search || undefined
      };

      const response = await productService.getAll(params);
      setProducts(response.data?.products || []);
      setPagination({
        page: response.data?.pagination?.currentPage || 1,
        totalPages: response.data?.pagination?.totalPages || 1
      });
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category_id: product.category_id || '',
        is_active: product.is_active
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        is_active: true
      });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      is_active: true
    });
    setImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData, imageFile);
      } else {
        await productService.create(formData, imageFile);
      }
      handleCloseModal();
      loadProducts(pagination.page);
    } catch (error) {
      alert(error.error || 'Error al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('�Est�s seguro de eliminar este producto?')) return;

    try {
      await productService.delete(id);
      loadProducts(pagination.page);
    } catch (error) {
      alert(error.error || 'Error al eliminar producto');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(1);
  };

  return (
    <div className="product-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="bi bi-box me-2"></i>
          Gesti�n de Productos
        </h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo Producto
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-3">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar producto..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Todas las categor�as</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
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

      {/* Products Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <Loading message="Cargando productos..." />
          ) : products.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '60px' }}>Img</th>
                    <th>Nombre</th>
                    <th>Categor�a</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th style={{ width: '120px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>
                        {product.image_url ? (
                          <img
                            src={`http://localhost:3000${product.image_url}`}
                            alt={product.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="rounded"
                          />
                        ) : (
                          <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                            <i className="bi bi-image text-muted"></i>
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                        <br />
                        <small className="text-muted">ID: {product.id}</small>
                      </td>
                      <td>{product.category?.name || '-'}</td>
                      <td>${parseFloat(product.price).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${product.is_active ? 'bg-primary' : 'bg-secondary'}`}>
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleOpenModal(product)}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(product.id)}
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
              icon="bi-box"
              title="No hay productos"
              message="Agrega tu primer producto"
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
                    <button className="page-link" onClick={() => loadProducts(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Categor�a</label>
                      <select
                        name="category_id"
                        className="form-select"
                        value={formData.category_id}
                        onChange={handleChange}
                      >
                        <option value="">Sin categor�a</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descripci�n</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Precio *</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        className="form-control"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
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

                  <div className="mb-3">
                    <label className="form-label">Imagen</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {editingProduct?.image_url && !imageFile && (
                      <small className="text-muted">
                        Imagen actual: {editingProduct.image_url}
                      </small>
                    )}
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

export default ProductManager;