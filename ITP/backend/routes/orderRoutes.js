const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

// Create a new order
router.post("/", orderController.createOrderHandler);

// Get all orders
router.get("/", orderController.getAllOrdersHandler);

// Get a single order by ID
router.get("/:id", orderController.getOrderByIdHandler);

// Update an order
router.put("/:id", orderController.updateOrderHandler);

// Delete an order
router.delete("/:id", orderController.deleteOrderHandler);

module.exports = router;
