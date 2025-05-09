const bookingService = require("../services/bookingService");

// Create a new booking
exports.createBookingHandler = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all bookings
exports.getAllBookingsHandler = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single booking by ID
exports.getBookingByIdHandler = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Update a booking
exports.updateBookingHandler = async (req, res) => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a booking
exports.deleteBookingHandler = async (req, res) => {
  try {
    const booking = await bookingService.deleteBooking(req.params.id);
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
