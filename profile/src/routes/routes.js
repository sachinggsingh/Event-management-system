import { verifyToken } from "../middleware/auth.js";
import express from "express";
import {setupProfile} from "../controller/controller.js";

const router = express.Router();

router.route("/setup").post(verifyToken, setupProfile);

export default router;