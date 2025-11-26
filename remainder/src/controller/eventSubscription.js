// controllers/eventSubscription.controller.js
import EventSubscription from "../model/eventSubscription.js";

export const subscribeToEvent = async (req, res) => {
  try {
    const { event_id, user_email } = req.body;

    const existing = await EventSubscription.findOne({ event_id, user_email });
    if (existing) return res.status(400).json({ success: false, message: "Already subscribed" });

    const subscription = new EventSubscription({ event_id, user_email });
    await subscription.save();

    res.status(201).json({ success: true, message: "Subscribed successfully", subscription });
  } catch (error) {
    console.error("Error subscribing:", error);
    res.status(500).json({ success: false, message: "Failed to subscribe" });
  }
};


export const getSubscriptionsByEvent = async (req, res) => {
  try {
    const subs = await EventSubscription.find({ event_id: req.params.eventId });
    res.json({ success: true, subscriptions: subs });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ success: false, message: "Failed to fetch subscriptions" });
  }
};


export const unsubscribeFromEvent = async (req, res) => {
  try {
    const sub = await EventSubscription.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: "Subscription not found" });
    res.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).json({ success: false, message: "Failed to unsubscribe" });
  }
};
