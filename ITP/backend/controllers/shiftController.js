const shiftService = require("../services/shiftService");

const getAllShifts = async (req, res) => {
  try {
    const shifts = await shiftService.getAllShifts();
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShiftById = async (req, res) => {
  try {
    const shift = await shiftService.getShiftById(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    res.json(shift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createShift = async (req, res) => {
  try {
    const newShift = await shiftService.createShift(req.body);
    res.status(201).json(newShift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateShift = async (req, res) => {
  try {
    const updatedShift = await shiftService.updateShift(
      req.params.id,
      req.body
    );
    if (!updatedShift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    res.json(updatedShift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteShift = async (req, res) => {
  try {
    const deletedShift = await shiftService.deleteShift(req.params.id);
    if (!deletedShift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    res.json({ message: "Shift deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
};
