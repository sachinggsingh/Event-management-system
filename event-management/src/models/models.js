import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  benefits: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Event = mongoose.model("Event", EventSchema);
