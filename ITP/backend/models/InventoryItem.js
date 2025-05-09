const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    inventoryId: {
      type: String,
      required: true,
      unique: true, // Ensures uniqueness
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    supplier: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    expireDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Middleware to handle duplicate inventoryId
inventoryItemSchema.pre("save", async function (next) {
  const existingItem = await this.constructor.findOne({
    inventoryId: this.inventoryId,
  });
  if (existingItem) {
    // Update the quantity instead of creating a new document
    existingItem.quantity += this.quantity;
    await existingItem.save();
    return next(new Error("Item already exists. Quantity updated."));
  }
  next();
});

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
