import axiosInstance from "./axiosConfig";

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post("/api/orders", orderData);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error creating order: ${error.response?.data?.message || error.message}`
    );
  }
};

// Get all orders
export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get("/api/orders");
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching orders: ${error.response?.data?.message || error.message}`
    );
  }
};

// Get a single order by ID
export const getOrderById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/orders/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching order: ${error.response?.data?.message || error.message}`
    );
  }
};

// Update an order
export const updateOrder = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`/api/orders/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error updating order: ${error.response?.data?.message || error.message}`
    );
  }
};

// Delete an order
export const deleteOrder = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/orders/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error deleting order: ${error.response?.data?.message || error.message}`
    );
  }
};
