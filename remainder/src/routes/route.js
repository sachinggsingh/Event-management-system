import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controller/event.js";
import {
  subscribeToEvent,
  getSubscriptionsByEvent,
  unsubscribeFromEvent,
} from "../controller/eventSubscription.js";
import {
  getAllReminders,
  createReminderLog,
  triggerReminderCheck,
} from "../controller/remainder.js";

import {verifyToken} from "../middleware/auth.js"

const router = express.Router();

// Event routes
router.post("/events", createEvent);
router.get("/events",verifyToken, getAllEvents);
router.get("/events/:id",verifyToken, getEventById);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

// Subscription routes
router.post("/subscriptions", subscribeToEvent);
router.get("/subscriptions/:eventId", verifyToken, getSubscriptionsByEvent);
router.delete("/subscriptions/:id", unsubscribeFromEvent);

// Reminder routes
router.get("/reminders",verifyToken, getAllReminders);
router.post("/reminders", createReminderLog);
router.post("/reminders/trigger", verifyToken, triggerReminderCheck); // Manually trigger reminder check

export default router;
