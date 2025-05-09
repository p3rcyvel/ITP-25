const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create a new user
router.post("/", userController.createUser);
router.post("/login", userController.loginUser);

// Get all users
router.get("/", userController.getUsers);

// Get a single user by ID
router.get("/:id", userController.getUser);

// Update a user
router.put("/:id", userController.updateUser);

// Delete a user
router.delete("/:id", userController.deleteUser);

module.exports = router;
