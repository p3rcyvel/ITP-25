const express = require("express");
const router = express.Router();
const orderAssignmentController = require("../controllers/orderAssignmentController");

// CRUD routes for order assignments
router.post("/", orderAssignmentController.createOrderAssignment);
router.get("/", orderAssignmentController.getAllOrderAssignments);
router.get("/:id", orderAssignmentController.getOrderAssignment);
router.put("/:id", orderAssignmentController.updateOrderAssignment);
router.delete("/:id", orderAssignmentController.deleteOrderAssignment);

module.exports = router;
