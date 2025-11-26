import express from "express";
import "dotenv/config";

import { ConnectDB } from "./db/db.js";
import userRouter from "./routes/user.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


ConnectDB();
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.json("hello from auth");
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
