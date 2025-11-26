import { UserProfile } from "../models/model.js";
import {ValidateProfile} from "../helpers/helpers.js"
export const setupProfile = async (req, res) => {
  try {
    // Validate incoming request body
    const { error } = ValidateProfile(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    // Use userId from token (middleware) or body (manual testing)
    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const { bio, interests, skills, experienceLevel } = req.body;

    // Check if profile already exists
    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      // Create new profile
      profile = await UserProfile.create({
        userId,
        bio,
        interests,
        skills,
        experienceLevel,
      });
    } else {
      // Update existing profile
      profile = await UserProfile.findOneAndUpdate(
        { userId },
        { bio, interests, skills, experienceLevel },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Error in Setting up the Profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
