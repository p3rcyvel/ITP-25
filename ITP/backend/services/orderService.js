const Order = require("../models/Order");
const FoodItem = require("../models/FoodItem");

// Create a new order
exports.createOrder = async (userId, orderData) => {
  try {
    const { items } = orderData;

    // Calculate total price based on food items and quantities
    let totalPrice = 0;
    for (const item of items) {
      const foodItem = await FoodItem.findById(item.foodItem);
      if (!foodItem) throw new Error(`Food item not found: ${item.foodItem}`);
      totalPrice += foodItem.price * item.quantity;
    }

    // Create the order
    const order = new Order({
      user: userId,
      items,
      totalPrice,
    });

    return await order.save();
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

// Get all orders
exports.getAllOrders = async () => {
  try {
    return await Order.find()
      .populate("user")
      .populate("items.foodItem")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

// Get a single order by ID
exports.getOrderById = async (id) => {
  try {
    const order = await Order.findById(id)
      .populate("user")
      .populate("items.foodItem");
    if (!order) throw new Error("Order not found");
    return order;
  } catch (error) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};

// Update an order
exports.updateOrder = async (id, updateData) => {
  try {
    const order = await Order.findByIdAndUpdate(id, updateData, { new: true })
      .populate("user")
      .populate("items.foodItem");
    if (!order) throw new Error("Order not found");
    return order;
  } catch (error) {
    throw new Error(`Error updating order: ${error.message}`);
  }
};

// Delete an order
exports.deleteOrder = async (id) => {
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) throw new Error("Order not found");
    return order;
  } catch (error) {
    throw new Error(`Error deleting order: ${error.message}`);
  }
};
