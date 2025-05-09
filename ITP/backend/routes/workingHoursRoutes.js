const express = require("express");
const router = express.Router();
const workingHoursController = require("../controllers/workingHoursController");

router.post("/", workingHoursController.createWorkingHours);
router.get("/user/:userId", workingHoursController.getUserWorkingHours);
router.get("/", workingHoursController.getAllWorkingHours);
router.put("/:id", workingHoursController.updateWorkingHours);
router.delete("/:id", workingHoursController.deleteWorkingHours);
router.get(
  "/user/:userId/date/:date",
  workingHoursController.getUserRecordForDate
);
module.exports = router;
