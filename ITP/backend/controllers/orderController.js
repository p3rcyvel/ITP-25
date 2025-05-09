const orderService = require("../services/orderService");

// Create a new order
exports.createOrderHandler = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body.user, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all orders
exports.getAllOrdersHandler = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single order by ID
exports.getOrderByIdHandler = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Update an order
exports.updateOrderHandler = async (req, res) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete an order
exports.deleteOrderHandler = async (req, res) => {
  try {
    const order = await orderService.deleteOrder(req.params.id);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
