import Event from "../model/event.js";
import EventSubscription from "../model/eventSubscription.js";
import Reminder from "../model/remainder.js";
import { sendReminderEmail } from "./emailService.js";

/**
 * Check for events that need reminders and send emails to subscribers
 * This function finds events where the reminder time is approaching
 */
export const checkAndSendReminders = async () => {
  try {
    const now = new Date();

    // Find all events that haven't passed yet
    const upcomingEvents = await Event.find({
      event_date: { $gt: now },
    }).exec();

    console.log(`Checking ${upcomingEvents.length} upcoming events for reminders...`);

    for (const event of upcomingEvents) {
      const reminderTimeMinutes = event.reminder_time_minutes || 60; // Default 60 minutes (1 hour)
      
      // Calculate when the reminder should be sent (event time - reminder time)
      const reminderTime = new Date(event.event_date);
      reminderTime.setMinutes(reminderTime.getMinutes() - reminderTimeMinutes);

      // Check if we're within the reminder window (within 5 minutes of reminder time)
      const timeDifference = now - reminderTime;
      const fiveMinutesInMs = 5 * 60 * 1000;

      // Only send if we're past the reminder time but within a 5-minute window
      if (timeDifference >= 0 && timeDifference <= fiveMinutesInMs) {
        // Check if reminders have already been sent for this event
        const existingReminders = await Reminder.find({ event_id: event._id }).exec();
        
        if (existingReminders.length > 0) {
          console.log(`Reminders already sent for event: ${event.title} (ID: ${event._id})`);
          continue;
        }

        // Get all subscribers for this event
        const subscriptions = await EventSubscription.find({
          event_id: event._id,
        }).exec();

        if (subscriptions.length === 0) {
          console.log(`No subscribers found for event: ${event.title} (ID: ${event._id})`);
          continue;
        }

        console.log(`Sending reminders for event: ${event.title} to ${subscriptions.length} subscriber(s)`);

        // Send reminder email to each subscriber
        const reminderPromises = subscriptions.map(async (subscription) => {
          try {
            const emailResult = await sendReminderEmail({
              to: subscription.user_email,
              eventTitle: event.title,
              eventDescription: event.description,
              eventDate: event.event_date,
              location: event.location,
              reminderTimeMinutes: reminderTimeMinutes,
            });

            // Log the reminder
            const reminderLog = new Reminder({
              event_id: event._id,
              user_email: subscription.user_email,
              status: emailResult.success ? "sent" : "failed",
            });
            await reminderLog.save();

            return emailResult;
          } catch (error) {
            console.error(
              `Error sending reminder to ${subscription.user_email} for event ${event.title}:`,
              error
            );

            // Log failed reminder
            try {
              const reminderLog = new Reminder({
                event_id: event._id,
                user_email: subscription.user_email,
                status: "failed",
              });
              await reminderLog.save();
            } catch (logError) {
              console.error("Error logging failed reminder:", logError);
            }

            return { success: false, error: error.message };
          }
        });

        await Promise.all(reminderPromises);
        console.log(`Completed sending reminders for event: ${event.title}`);
      }
    }
  } catch (error) {
    console.error("Error in checkAndSendReminders:", error);
  }
};

/**
 * Start the reminder scheduler that runs periodically
 * @param {Number} intervalMinutes - How often to check (in minutes). Default: 5 minutes
 */
export const startReminderScheduler = (intervalMinutes = 5) => {
  console.log(`Starting reminder scheduler (checking every ${intervalMinutes} minutes)...`);

  // Run immediately on startup
  checkAndSendReminders();

  // Then run at the specified interval
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(() => {
    checkAndSendReminders();
  }, intervalMs);

  console.log("Reminder scheduler is running");
};

