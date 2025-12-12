import api from './api';

const searchService = {
  /**
   * Buscar productos
   */
  search: async (query, filters = {}) => {
    try {
      const params = {
        q: query,
        ...filters
      };
      const response = await api.get('/search', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default searchService;