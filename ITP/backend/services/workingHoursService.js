const WorkingHours = require("../models/WorkingHours");

const createWorkingHours = async (workingHoursData) => {
  const workingHours = new WorkingHours(workingHoursData);
  return await workingHours.save();
};

const getWorkingHoursByUser = async (userId) => {
  return await WorkingHours.find({ user: userId }).sort({ date: -1 });
};

const getAllWorkingHours = async () => {
  return await WorkingHours.find().populate("user", "name email");
};

const updateWorkingHours = async (id, updateData) => {
  return await WorkingHours.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteWorkingHours = async (id) => {
  return await WorkingHours.findByIdAndDelete(id);
};

module.exports = {
  createWorkingHours,
  getWorkingHoursByUser,
  getAllWorkingHours,
  updateWorkingHours,
  deleteWorkingHours,
};
