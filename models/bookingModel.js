const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Tour",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Booking", bookingSchema);
