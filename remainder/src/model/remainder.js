// models/reminderLog.model.js
import mongoose from "mongoose";

const reminderLogSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user_email: {
      type: String,
      required: true,
      trim: true,
    },
    sent_at: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "sent",
    },
  },
  { timestamps: false }
);

// Indexes
reminderLogSchema.index({ event_id: 1 });
reminderLogSchema.index({ user_email: 1 });

const Reminder = mongoose.model("Reminder", reminderLogSchema);
export default Reminder;
