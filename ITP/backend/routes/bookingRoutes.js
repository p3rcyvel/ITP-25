const express = require("express");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

// Create a new booking
router.post("/", bookingController.createBookingHandler);

// Get all bookings
router.get("/", bookingController.getAllBookingsHandler);

// Get a single booking by ID
router.get("/:id", bookingController.getBookingByIdHandler);

// Update a booking
router.put("/:id", bookingController.updateBookingHandler);

// Delete a booking
router.delete("/:id", bookingController.deleteBookingHandler);

module.exports = router;
