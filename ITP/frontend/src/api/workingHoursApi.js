import axiosInstance from "./axiosConfig";

// Create a new working hours record
export const createWorkingHours = async (workingHoursData) => {
  try {
    const response = await axiosInstance.post(
      "/api/working-hours",
      workingHoursData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error creating working hours: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Get all working hours records
export const getAllWorkingHours = async () => {
  try {
    const response = await axiosInstance.get("/api/working-hours");
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching working hours: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Get working hours for a specific user
export const getUserWorkingHours = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/api/working-hours/user/${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching user working hours: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Get working hours for a specific user on a specific date
export const getUserRecordForDate = async (userId, date) => {
  try {
    const response = await axiosInstance.get(
      `/api/working-hours/user/${userId}/date/${date}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching user record for date: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Update a working hours record
export const updateWorkingHours = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(
      `/api/working-hours/${id}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error updating working hours: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Delete a working hours record
export const deleteWorkingHours = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/working-hours/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error deleting working hours: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};
