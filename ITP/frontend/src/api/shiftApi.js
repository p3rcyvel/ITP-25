import axiosInstance from "./axiosConfig";

// Get all shifts
export const getAllShifts = async () => {
  try {
    const response = await axiosInstance.get("/api/shifts");
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching shifts: ${error.response?.data?.message || error.message}`
    );
  }
};

// Get a single shift by ID
export const getShiftById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/shifts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching shift: ${error.response?.data?.message || error.message}`
    );
  }
};

// Create a new shift
export const createShift = async (shiftData) => {
  try {
    const response = await axiosInstance.post("/api/shifts", shiftData);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error creating shift: ${error.response?.data?.message || error.message}`
    );
  }
};

// Update a shift
export const updateShift = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`/api/shifts/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error updating shift: ${error.response?.data?.message || error.message}`
    );
  }
};

// Delete a shift
export const deleteShift = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/shifts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error deleting shift: ${error.response?.data?.message || error.message}`
    );
  }
};
