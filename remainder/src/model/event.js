import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    event_date: {
      type: Date,
      required: true,
    },
    reminder_time_minutes: {
      type: Number,
      default: 60,
      required: true,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Index for performance
eventSchema.index({ event_date: 1 });

const Event = mongoose.model("Event", eventSchema);
export default Event;
