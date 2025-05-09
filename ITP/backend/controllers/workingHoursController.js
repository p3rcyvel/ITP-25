const WorkingHours = require("../models/WorkingHours");
const workingHoursService = require("../services/workingHoursService");

const createWorkingHours = async (req, res) => {
  try {
    const newWorkingHours = await workingHoursService.createWorkingHours(
      req.body
    );
    res.status(201).json(newWorkingHours);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserWorkingHours = async (req, res) => {
  try {
    const workingHours = await workingHoursService.getWorkingHoursByUser(
      req.params.userId
    );
    res.json(workingHours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllWorkingHours = async (req, res) => {
  try {
    const allWorkingHours = await workingHoursService.getAllWorkingHours();
    res.json(allWorkingHours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWorkingHours = async (req, res) => {
  try {
    const updatedHours = await workingHoursService.updateWorkingHours(
      req.params.id,
      req.body
    );
    if (!updatedHours) {
      return res
        .status(404)
        .json({ message: "Working hours record not found" });
    }
    res.json(updatedHours);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteWorkingHours = async (req, res) => {
  try {
    const deletedHours = await workingHoursService.deleteWorkingHours(
      req.params.id
    );
    if (!deletedHours) {
      return res
        .status(404)
        .json({ message: "Working hours record not found" });
    }
    res.json({ message: "Working hours record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserRecordForDate = async (req, res) => {
  try {
    const { userId, date } = req.params;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const record = await WorkingHours.findOne({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    if (!record) {
      return res.status(404).json({ message: "No record found for this date" });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createWorkingHours,
  getUserWorkingHours,
  getAllWorkingHours,
  updateWorkingHours,
  getUserRecordForDate,
  deleteWorkingHours,
};
