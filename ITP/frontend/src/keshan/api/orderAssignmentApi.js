import api from "./apiConfig";

export const orderAssignmentApi = {
  // Create order assignment
  create: async (orderAssignmentData) => {
    try {
      const response = await api.post(
        "/order-assignments",
        orderAssignmentData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get all order assignments
  getAll: async () => {
    try {
      const response = await api.get("/order-assignments");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get single order assignment
  get: async (id) => {
    try {
      const response = await api.get(`/order-assignments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Update order assignment
  update: async (id, updateData) => {
    try {
      const response = await api.put(`/order-assignments/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Delete order assignment
  delete: async (id) => {
    try {
      const response = await api.delete(`/order-assignments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get orders by staff member
  getByStaff: async (userId) => {
    try {
      const response = await api.get(`/order-assignments/staff/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get orders by status
  getByStatus: async (status) => {
    try {
      const response = await api.get(`/order-assignments/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};
