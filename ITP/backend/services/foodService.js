const FoodItem = require("../models/FoodItem");

// Create a new food item
exports.createFoodItem = async (foodData) => {
  try {
    const foodItem = new FoodItem(foodData);
    return await foodItem.save();
  } catch (error) {
    throw new Error(`Error creating food item: ${error.message}`);
  }
};

// Get all food items
exports.getAllFoodItems = async () => {
  try {
    return await FoodItem.find().sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(`Error fetching food items: ${error.message}`);
  }
};

// Get a single food item by ID
exports.getFoodItemById = async (id) => {
  try {
    const foodItem = await FoodItem.findById(id);
    if (!foodItem) throw new Error("Food item not found");
    return foodItem;
  } catch (error) {
    throw new Error(`Error fetching food item: ${error.message}`);
  }
};

// Update a food item
exports.updateFoodItem = async (id, updateData) => {
  try {
    const foodItem = await FoodItem.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!foodItem) throw new Error("Food item not found");
    return foodItem;
  } catch (error) {
    throw new Error(`Error updating food item: ${error.message}`);
  }
};

// Delete a food item
exports.deleteFoodItem = async (id) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(id);
    if (!foodItem) throw new Error("Food item not found");
    return foodItem;
  } catch (error) {
    throw new Error(`Error deleting food item: ${error.message}`);
  }
};
