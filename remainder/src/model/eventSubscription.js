// models/eventSubscription.model.js
import mongoose from "mongoose";

const eventSubscriptionSchema = new mongoose.Schema(
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
    subscribed_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// Indexes
eventSubscriptionSchema.index({ event_id: 1 });
eventSubscriptionSchema.index({ user_email: 1 });

const EventSubscription = mongoose.model(
  "EventSubscription",
  eventSubscriptionSchema
);
export default EventSubscription;
