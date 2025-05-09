import api from "./apiConfig";

export const workingHoursApi = {
  /**
   * Create new working hours record
   * @param {Object} workingHoursData - { user: userId, date: Date, clockIn: Date, clockOut: Date }
   * @returns {Promise<Object>} Created working hours record
   */
  create: async (workingHoursData) => {
    try {
      const response = await api.post("/working-hours", workingHoursData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get working hours for a specific user
   * @param {string} userId - User ID to fetch records for
   * @returns {Promise<Array>} Array of working hours records
   */
  getUserWorkingHours: async (userId) => {
    try {
      const response = await api.get(`/working-hours/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get all working hours records
   * @returns {Promise<Array>} Array of all working hours records
   */
  getAll: async () => {
    try {
      const response = await api.get("/working-hours");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update working hours record
   * @param {string} id - Record ID to update
   * @param {Object} updateData - Fields to update { clockIn?, clockOut?, date? }
   * @returns {Promise<Object>} Updated working hours record
   */
  update: async (id, updateData) => {
    try {
      const response = await api.put(`/working-hours/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete working hours record
   * @param {string} id - Record ID to delete
   * @returns {Promise<Object>} Success message
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/working-hours/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Clock in a user
   * @param {string} userId - User ID to clock in
   * @returns {Promise<Object>} Created working hours record
   */
  clockIn: async (userId) => {
    try {
      const response = await api.post("/working-hours", {
        user: userId,
        clockIn: new Date(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Clock out a user
   * @param {string} recordId - Working hours record ID to clock out
   * @returns {Promise<Object>} Updated working hours record
   */
  clockOut: async (recordId) => {
    try {
      const response = await api.put(`/working-hours/${recordId}`, {
        clockOut: new Date(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getUserRecordForDate: async (userId, date) => {
    try {
      const response = await api.get(
        `/working-hours/user/${userId}/date/${date}`
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // No record found for this date
      }
      throw error.response?.data || error.message;
    }
  },
};
