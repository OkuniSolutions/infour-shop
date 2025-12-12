import api from './api';

const userService = {
  /**
   * Obtener todos los usuarios (admin)
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener usuario por ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Crear usuario (admin)
   */
  create: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Actualizar usuario (admin)
   */
  update: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Eliminar usuario (admin)
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Actualizar perfil del usuario actual
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cambiar contraseña del usuario actual
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default userService;