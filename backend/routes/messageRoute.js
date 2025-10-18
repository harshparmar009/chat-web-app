import { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { getAcceptedUsers, getAllUsers, getMessages, messageCounter, sendMessage } from "../controllers/messageController.js"
import { chatRequest, chatRequestAccept, chatRequestDecline, checkChatRequest, getChatRequest } from "../controllers/authController.js";

const router = Router()

router.get("/users",isAuthenticated, getAllUsers)
router.get("/message-counter",isAuthenticated, messageCounter)
router.get("/accepted-users", isAuthenticated, getAcceptedUsers)
router.get("/:id", isAuthenticated, getMessages);
router.post("/send/:id", isAuthenticated, sendMessage);
router.post("/chat-request", isAuthenticated, chatRequest);
router.post("/check-chat-request", isAuthenticated, checkChatRequest);
router.get("/chat-request/:userId", getChatRequest);
router.post("/chat-request/accept", isAuthenticated, chatRequestAccept);
router.post("/chat-request/decline", isAuthenticated, chatRequestDecline);
// router.post("/register",isAuthenticated, signUpController)

export default router