require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose
  .connect(
    "mongodb+srv://nethum19thilakarathna:itpm2025@cluster1.eqi3z.mongodb.net/sss?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("User Management API");
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/shifts", require("./routes/shiftRoutes"));
app.use("/api/working-hours", require("./routes/workingHoursRoutes"));
app.use("/api/order-assignments", require("./routes/orderAssigmentRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
const inventoryRoutes = require("./routes/inventoryRoutes");
app.use("/api/inventory", inventoryRoutes);
const foodRoutes = require("./routes/foodRoutes");
app.use("/api/food", foodRoutes);
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
