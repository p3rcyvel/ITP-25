import api from "./apiConfig";

export const shiftApi = {
  // Get all shifts
  getAll: async () => {
    try {
      const response = await api.get("/shifts");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get single shift by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/shifts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Create new shift
  create: async (shiftData) => {
    try {
      const response = await api.post("/shifts", shiftData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Update existing shift
  update: async (id, updateData) => {
    try {
      const response = await api.put(`/shifts/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Delete shift
  delete: async (id) => {
    try {
      const response = await api.delete(`/shifts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};
