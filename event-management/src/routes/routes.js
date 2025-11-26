import express from "express"

import {CreateEvent,
    GetAllTheEvent,
    GetEventById,
    DeleteEventById,
    UpdateEventById
} from "../controllers/controller.js"

const router = express.Router()

router.route("/create").post(CreateEvent)
router.route("/get").get(GetAllTheEvent)
router.route("/get/:id").get(GetEventById)
router.route("/delete/:id").delete(DeleteEventById)
router.route("/update/:id").put(UpdateEventById)

export default router