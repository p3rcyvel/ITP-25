const express = require("express");
const foodController = require("../controllers/foodController");

const router = express.Router();

// Create a new food item
router.post("/", foodController.createFoodItemHandler);

// Get all food items
router.get("/", foodController.getAllFoodItemsHandler);

// Get a single food item by ID
router.get("/:id", foodController.getFoodItemByIdHandler);

// Update a food item
router.put("/:id", foodController.updateFoodItemHandler);

// Delete a food item
router.delete("/:id", foodController.deleteFoodItemHandler);

module.exports = router;
