import express from "express"
import "dotenv/config";

import { ConnectDB } from "./config/db.js";
import eventRoutes from "./routes/route.js"
import { startReminderScheduler } from "./helpers/reminderScheduler.js";

const app= express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

ConnectDB()

// Start the reminder scheduler
// Checks every 5 minutes for events that need reminders
const schedulerInterval = parseInt(process.env.REMINDER_CHECK_INTERVAL_MINUTES) || 5;
startReminderScheduler(schedulerInterval);

app.get("/",(req,res)=>{
    res.json("hello from remainder service")
})

app.use("/event", eventRoutes)
const PORT= process.env.PORT || 8002

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
    console.log(`Reminder scheduler is active (checking every ${schedulerInterval} minutes)`)
})