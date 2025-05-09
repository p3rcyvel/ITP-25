import axiosInstance from "./axiosConfig";

// Create a new user
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/api/users", userData);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error creating user: ${error.response?.data?.message || error.message}`
    );
  }
};

// Login a user
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/api/users/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error logging in: ${error.response?.data?.message || error.message}`
    );
  }
};

// Get all users
export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users");
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching users: ${error.response?.data?.message || error.message}`
    );
  }
};

// Get a single user by ID
export const getUser = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching user: ${error.response?.data?.message || error.message}`
    );
  }
};

// Update a user
export const updateUser = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`/api/users/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error updating user: ${error.response?.data?.message || error.message}`
    );
  }
};

// Delete a user
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error deleting user: ${error.response?.data?.message || error.message}`
    );
  }
};
