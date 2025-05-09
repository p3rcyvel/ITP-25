import axios from "axios";

// Base URL for the booking API
const BASE_URL = "http://localhost:5001/api/bookings";

export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(BASE_URL, bookingData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create booking"
    );
  }
};

export const getAllBookings = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch bookings"
    );
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch booking");
  }
};

export const updateBooking = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update booking"
    );
  }
};

export const deleteBooking = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete booking"
    );
  }
};
