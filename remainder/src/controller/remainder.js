// controllers/reminderLog.controller.js
import Reminder from "../model/remainder.js";
import { checkAndSendReminders } from "../helpers/reminderScheduler.js";


export const getAllReminders = async (req, res) => {
  try {
    const logs = await Reminder.find()
      .populate("event_id", "title event_date")
      .sort({ sent_at: -1 });
    res.json({ success: true, reminderLogs: logs });
  } catch (error) {
    console.error("Error fetching reminder logs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reminder logs" });
  }
};


export const createReminderLog = async (req, res) => {
  try {
    const { event_id, user_email, status } = req.body;

    const log = new Reminder({
      event_id,
      user_email,
      status: status || "sent",
    });

    await log.save();
    res.status(201).json({ success: true, message: "Reminder log created", log });
  } catch (error) {
    console.error("Error creating reminder log:", error);
    res.status(500).json({ success: false, message: "Failed to create reminder log" });
  }
};

/**
 * Manually trigger reminder check and send
 * This can be called via API to manually check for and send reminders
 */
export const triggerReminderCheck = async (req, res) => {
  try {
    console.log("Manual reminder check triggered");
    await checkAndSendReminders();
    res.json({ success: true, message: "Reminder check completed" });
  } catch (error) {
    console.error("Error in manual reminder check:", error);
    res.status(500).json({ success: false, message: "Failed to check reminders", error: error.message });
  }
};
