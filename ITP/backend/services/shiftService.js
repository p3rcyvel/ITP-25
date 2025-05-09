const Shift = require("../models/Shift");

const getAllShifts = async () => {
  return await Shift.find().populate("user", "_id name email");
};

const getShiftById = async (id) => {
  return await Shift.findById(id).populate("user", "name email");
};

const createShift = async (shiftData) => {
  const shift = new Shift(shiftData);
  return await shift.save();
};

const updateShift = async (id, shiftData) => {
  return await Shift.findByIdAndUpdate(id, shiftData, { new: true });
};

const deleteShift = async (id) => {
  return await Shift.findByIdAndDelete(id);
};

module.exports = {
  getAllShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
};
