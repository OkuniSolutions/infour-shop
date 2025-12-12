import api from './api';

const saleService = {
  /**
   * Crear una venta (checkout)
   */
  create: async (saleData) => {
    try {
      const response = await api.post('/sales', saleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener mis ventas
   */
  getMySales: async (params = {}) => {
    try {
      const response = await api.get('/sales/my-sales', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener venta por ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/sales/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener todas las ventas (admin)
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/sales', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Actualizar estado de venta (admin)
   */
  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/sales/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener estadísticas (admin)
   */
  getStats: async () => {
    try {
      const response = await api.get('/sales/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default saleService;