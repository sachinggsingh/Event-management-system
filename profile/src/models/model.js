import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,   //user _id (string)
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: "",
  },
  interests: {
    type: [String], 
    default: [],
  },
  skills: {
    type: [String], 
    default: [],
  },
  experienceLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Expert"],
    default: "Beginner",
  },
  createdAt: { type: Date, default: Date.now },
});

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);
