const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A cycle must have a name"],
      unique: true,
      trim: true,
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now,
      select: false, // now this won't show for select
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: { type: [Number], default: [0, 0] },
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Cycle = mongoose.model("Cycle", cycleSchema);
module.exports = Cycle;
