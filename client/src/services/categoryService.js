import api from './api';

const categoryService = {
  /**
   * Obtener todas las categorías
   */
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener categoría por ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Crear categoría
   */
  create: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Actualizar categoría
   */
  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Eliminar categoría
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default categoryService;