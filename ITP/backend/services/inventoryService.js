const InventoryItem = require("../models/InventoryItem");
const { sendEmail } = require("./emailService");

// Add or update an inventory item
exports.addOrUpdateInventoryItem = async (itemData) => {

  try {
    let { category, expireDate, inventoryId, name, price, quantity, supplier } = itemData;

    // Validation
    inventoryId = Number(inventoryId);

    if (!inventoryId ) {
      return { status: false, message: 'Missing inventory Id' };
    }
    
    if (isNaN(inventoryId) || inventoryId < 1111 || inventoryId > 9999) {
      return { status: false, message: 'Invalid Inventory ID format' };
    }

    

    if (!name || typeof name !== 'string') {
      return { status: false, message: 'Invalid or missing item name' };
    }

    if (!category) {
      return { status: false, message: 'Invalid or missing category' };
    }

    if (!supplier || typeof supplier !== 'string') {
      return { status: false, message: 'Invalid or missing supplier' };
    }


     quantity = Number(quantity);
    if (isNaN(quantity) || quantity < 0) {
      return { status: false, message: 'Quantity must be a non-negative number' };
    }


    price = Number(price);
    if (isNaN(price) || price < 0) {
      return { status: false, message: 'Price must be a non-negative number' };
    }

   
    if (!expireDate || isNaN(Date.parse(expireDate)) || new Date(expireDate) <= new Date()) {
      return { status: false, message: 'Expiration date must be a future date larger than today' };
    }

    else {
      // Check if the item already exists
      const existingItem = await InventoryItem.findOne({ inventoryId });

      // if (existingItem) {
      //   // Update the quantity if the item exists
      //   existingItem.quantity += quantity;
      //   await existingItem.save();
      //               return { status: true, message: 'Quantity Updated Succesfully' };

      // }

      // Create a new item if it doesn't exist
      const newItem = new InventoryItem(itemData);
      await newItem.save();
            return { status: true, message: 'Product Added Succesfully!' };

    }

  } catch (error) {
    throw new Error(`Error adding/updating inventory item: ${error.message}`);
  }
};

// Get all inventory items
exports.getAllInventoryItems = async () => {
  try {
    await checkAndNotifyExpiringItems();
    return await InventoryItem.find().sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};

// Get a single inventory item by ID
exports.getInventoryItemById = async (id) => {
  try {
    const item = await InventoryItem.findById(id);

    if (!item) throw new Error("Inventory item not found");
    return item;
  } catch (error) {
    throw new Error(`Error fetching inventory item: ${error.message}`);
  }
};

// Update an inventory item
exports.updateInventoryItem = async (id, updateData) => {
  try {
    

    const item = await InventoryItem.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!item) throw new Error("Inventory item not found");
    return item;
  } catch (error) {
    throw new Error(`Error updating inventory item: ${error.message}`);
  }
};

// Delete an inventory item
exports.deleteInventoryItem = async (id) => {
  try {
    const item = await InventoryItem.findByIdAndDelete(id);
    if (!item) throw new Error("Inventory item not found");
    return item;
  } catch (error) {
    throw new Error(`Error deleting inventory item: ${error.message}`);
  }
};
const checkAndNotifyExpiringItems = async () => {
  try {
    // Calculate the date for items expiring within the next 7 days
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    // Find items that expire within the next 7 days
    const expiringItems = await InventoryItem.find({
      expireDate: { $gte: today, $lte: sevenDaysLater },
    }).sort({ expireDate: 1 });
    console.log("Expiring items:", expiringItems);
    // If there are expiring items, send a notification email
    if (expiringItems.length > 0) {
      // Generate the email content
      let emailText =
        "The following inventory items are expiring within the next 7 days:\n\n";
      let emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Inventory Expiration Alert</h2>
          <p>The following inventory items are expiring within the next 7 days:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Inventory ID</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Name</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Category</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Quantity</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Expiration Date</th>
            </tr>
      `;

      // Add each item to the email content
      expiringItems.forEach((item) => {
        const expirationDate = new Date(item.expireDate).toLocaleDateString();

        // Plain text version
        emailText += `ID: ${item.inventoryId} | Name: ${item.name} | Category: ${item.category} | Quantity: ${item.quantity} | Expires: ${expirationDate}\n`;

        // HTML version
        emailHtml += `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.inventoryId}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.category}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${expirationDate}</td>
          </tr>
        `;
      });

      // Complete the HTML email
      emailHtml += `
          </table>
          <p style="margin-top: 20px;">Please take action to manage these items before they expire.</p>
        </div>
      `;

      // Send the notification email to the inventory manager
      await sendEmail({
        to: "darksparrow156@gmail.com", //replace
        subject: "ALERT: Inventory Items Expiring Soon",
        text: emailText,
        html: emailHtml,
      });

      console.log(
        `Expiration notification sent for ${expiringItems.length} items`
      );
    }
  } catch (error) {
    console.error("Error checking expiring items:", error);
  }
};
