import express from "express"
import "dotenv/config"

import {ConnectDB} from "./config/db.js"
import ProfileRouter from "./routes/routes.js"

const app = express()

ConnectDB()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.json("hello from remainder service")
})

app.use("/profile", ProfileRouter)
const PORT= process.env.PORT || 8004

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})