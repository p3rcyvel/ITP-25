const foodService = require("../services/foodService");

// Create a new food item
exports.createFoodItemHandler = async (req, res) => {
  try {
    const foodItem = await foodService.createFoodItem(req.body);
    res.status(201).json({ success: true, data: foodItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all food items
exports.getAllFoodItemsHandler = async (req, res) => {
  try {
    const foodItems = await foodService.getAllFoodItems();
    res.status(200).json({ success: true, data: foodItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single food item by ID
exports.getFoodItemByIdHandler = async (req, res) => {
  try {
    const foodItem = await foodService.getFoodItemById(req.params.id);
    res.status(200).json({ success: true, data: foodItem });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Update a food item
exports.updateFoodItemHandler = async (req, res) => {
  try {
    const foodItem = await foodService.updateFoodItem(req.params.id, req.body);
    res.status(200).json({ success: true, data: foodItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a food item
exports.deleteFoodItemHandler = async (req, res) => {
  try {
    const foodItem = await foodService.deleteFoodItem(req.params.id);
    res.status(200).json({ success: true, data: foodItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
