const Booking = require("../models/Booking");

// Create a new booking
exports.createBooking = async (bookingData) => {
  try {
    const booking = new Booking(bookingData);
    return await booking.save();
  } catch (error) {
    throw new Error(`Error creating booking: ${error.message}`);
  }
};

// Get all bookings
exports.getAllBookings = async () => {
  try {
    return await Booking.find().sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(`Error fetching bookings: ${error.message}`);
  }
};

// Get a single booking by ID
exports.getBookingById = async (id) => {
  try {
    const booking = await Booking.findById(id);
    if (!booking) throw new Error("Booking not found");
    return booking;
  } catch (error) {
    throw new Error(`Error fetching booking: ${error.message}`);
  }
};

// Update a booking
exports.updateBooking = async (id, updateData) => {
  try {
    const booking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!booking) throw new Error("Booking not found");
    return booking;
  } catch (error) {
    throw new Error(`Error updating booking: ${error.message}`);
  }
};

// Delete a booking
exports.deleteBooking = async (id) => {
  try {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) throw new Error("Booking not found");
    return booking;
  } catch (error) {
    throw new Error(`Error deleting booking: ${error.message}`);
  }
};
