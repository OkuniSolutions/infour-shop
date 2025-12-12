import api from './api';

const productService = {
  /**
   * Obtener todos los productos con filtros
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener un producto por ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Crear producto (con o sin imagen)
   */
  create: async (productData, imageFile = null) => {
    try {
      let formData;
      
      if (imageFile) {
        // Si hay imagen, usar FormData
        formData = new FormData();
        Object.keys(productData).forEach(key => {
          formData.append(key, productData[key]);
        });
        formData.append('image', imageFile);
      } else {
        // Si no hay imagen, enviar JSON
        formData = productData;
      }

      const response = await api.post('/products', formData, {
        headers: imageFile ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Actualizar producto
   */
  update: async (id, productData, imageFile = null) => {
    try {
      let formData;
      
      if (imageFile) {
        formData = new FormData();
        Object.keys(productData).forEach(key => {
          formData.append(key, productData[key]);
        });
        formData.append('image', imageFile);
      } else {
        formData = productData;
      }

      const response = await api.put(`/products/${id}`, formData, {
        headers: imageFile ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Eliminar producto
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default productService;