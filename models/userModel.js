const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter a name"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "please enter an email"],
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
    },
    bookings: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tour",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
