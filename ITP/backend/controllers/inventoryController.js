const inventoryService = require("../services/inventoryService");

// Add or update an inventory item
exports.addOrUpdateInventoryItemHandler = async (req, res) => {
  try {
    const item = await inventoryService.addOrUpdateInventoryItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all inventory items
exports.getAllInventoryItemsHandler = async (req, res) => {
  try {
    const items = await inventoryService.getAllInventoryItems();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single inventory item by ID
exports.getInventoryItemByIdHandler = async (req, res) => {
  try {
    const item = await inventoryService.getInventoryItemById(req.params.id);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Update an inventory item
exports.updateInventoryItemHandler = async (req, res) => {
  try {
    const item = await inventoryService.updateInventoryItem(
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete an inventory item
exports.deleteInventoryItemHandler = async (req, res) => {
  try {
    const item = await inventoryService.deleteInventoryItem(req.params.id);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
