const User = require("../models/User");

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    return await User.find({});
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, updateData) => {
  try {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    return await User.findByIdAndDelete(userId);
  } catch (error) {
    throw error;
  }
};
const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare passwords
    const isMatch = password === user.password;
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
};
