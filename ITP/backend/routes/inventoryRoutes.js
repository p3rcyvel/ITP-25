const express = require("express");
const inventoryController = require("../controllers/inventoryController");

const router = express.Router();

// Add or update an inventory item
router.post("/", inventoryController.addOrUpdateInventoryItemHandler);

// Get all inventory items
router.get("/", inventoryController.getAllInventoryItemsHandler);

// Get a single inventory item by ID
router.get("/:id", inventoryController.getInventoryItemByIdHandler);

// Update an inventory item
router.put("/:id", inventoryController.updateInventoryItemHandler);

// Delete an inventory item
router.delete("/:id", inventoryController.deleteInventoryItemHandler);

module.exports = router;
