import express from "express";

const router = express.Router();

import { LoginUser, CreateUser, LogoutUser } from "../controllers/user.js";

router.route("/login").post(LoginUser);
router.route("/register").post(CreateUser);
router.route("/logout").post(LogoutUser);

export default router;
