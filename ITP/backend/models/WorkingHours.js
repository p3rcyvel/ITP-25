const mongoose = require("mongoose");

const workingHoursSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  clockIn: {
    type: Date,
    required: true,
  },
  clockOut: {
    type: Date,
  },
  totalHours: {
    type: Number,
  },
});

workingHoursSchema.pre("save", function (next) {
  if (this.clockOut) {
    const diff = this.clockOut - this.clockIn;
    this.totalHours = diff / (1000 * 60 * 60); // Convert ms to hours
  }
  next();
});

module.exports = mongoose.model("WorkingHours", workingHoursSchema);
