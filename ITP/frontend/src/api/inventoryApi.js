import axiosInstance from "./axiosConfig";

// Add or update an inventory item
export const addOrUpdateInventoryItem = async (inventoryData) => {
  try {
    const response = await axiosInstance.post("/api/inventory", inventoryData);
    return (response.data.data)
  } catch (error) {
    throw new Error(
      `Error adding/updating inventory item: ${error.response?.data?.message || error.message
      }`
    );
  }
};

// Get all inventory items
export const getAllInventoryItems = async () => {
  try {
    const response = await axiosInstance.get("/api/inventory");
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching inventory items: ${error.response?.data?.message || error.message
      }`
    );
  }
};

// Get a single inventory item by ID
export const getInventoryItemById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/inventory/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching inventory item: ${error.response?.data?.message || error.message
      }`
    );
  }
};

// Update an inventory item
export const updateInventoryItem = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(
      `/api/inventory/${id}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error updating inventory item: ${error.response?.data?.message || error.message
      }`
    );
  }
};

// Delete an inventory item
export const deleteInventoryItem = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/inventory/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error deleting inventory item: ${error.response?.data?.message || error.message
      }`
    );
  }
};
