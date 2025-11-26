import express from "express"
import dotenv from "dotenv"
dotenv.config()

import { ConnectDB } from "./config/db.js";

import EventRouter from "./routes/routes.js"
ConnectDB()

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.json("hello from event management service")
})
app.use("/event", EventRouter)

const PORT = process.env.PORT || 8002

app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
);