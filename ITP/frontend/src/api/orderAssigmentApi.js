import axiosInstance from "./axiosConfig";

// Create a new order assignment
export const createOrderAssignment = async (assignmentData) => {
  try {
    const response = await axiosInstance.post(
      "/api/order-assignments",
      assignmentData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error creating order assignment: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Get all order assignments
export const getAllOrderAssignments = async () => {
  try {
    const response = await axiosInstance.get("/api/order-assignments");
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching order assignments: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Get a single order assignment by ID
export const getOrderAssignment = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/order-assignments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching order assignment: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Update an order assignment
export const updateOrderAssignment = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(
      `/api/order-assignments/${id}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error updating order assignment: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Delete an order assignment
export const deleteOrderAssignment = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/order-assignments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error deleting order assignment: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};
