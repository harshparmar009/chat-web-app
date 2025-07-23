import { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { getAllUsers, getMessages, sendMessage } from "../controllers/messageController.js"

const router = Router()

router.get("/users",isAuthenticated, getAllUsers)
router.get("/:id", isAuthenticated, getMessages);
router.post("/send/:id", isAuthenticated, sendMessage);
// router.post("/register",isAuthenticated, signUpController)

export default router