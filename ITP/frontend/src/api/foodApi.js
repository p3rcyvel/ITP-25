import axiosInstance from "./axiosConfig";

// Create a new food item
export const createFoodItem = async (foodData) => {
  try {
    const response = await axiosInstance.post("/api/food", foodData);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error creating food item: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Get all food items
export const getAllFoodItems = async () => {
  try {
    const response = await axiosInstance.get("/api/food");
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching food items: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Get a single food item by ID
export const getFoodItemById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/food/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching food item: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Update a food item
export const updateFoodItem = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`/api/food/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error updating food item: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Delete a food item
export const deleteFoodItem = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/food/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error deleting food item: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};
