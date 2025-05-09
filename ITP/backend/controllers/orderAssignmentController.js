const orderAssignmentService = require("../services/orderAssignmentService");

const createOrderAssignment = async (req, res) => {
  try {
    const newAssignment = await orderAssignmentService.createOrderAssignment(
      req.body
    );
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllOrderAssignments = async (req, res) => {
  try {
    const assignments = await orderAssignmentService.getAllOrderAssignments();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderAssignment = async (req, res) => {
  try {
    const assignment = await orderAssignmentService.getOrderAssignmentById(
      req.params.id
    );
    if (!assignment) {
      return res.status(404).json({ message: "Order assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderAssignment = async (req, res) => {
  try {
    const updatedAssignment =
      await orderAssignmentService.updateOrderAssignment(
        req.params.id,
        req.body
      );
    if (!updatedAssignment) {
      return res.status(404).json({ message: "Order assignment not found" });
    }
    res.json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteOrderAssignment = async (req, res) => {
  try {
    const deletedAssignment =
      await orderAssignmentService.deleteOrderAssignment(req.params.id);
    if (!deletedAssignment) {
      return res.status(404).json({ message: "Order assignment not found" });
    }
    res.json({ message: "Order assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrderAssignment,
  getAllOrderAssignments,
  getOrderAssignment,
  updateOrderAssignment,
  deleteOrderAssignment,
};
