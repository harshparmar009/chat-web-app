import { Router } from "express";
import { signInController, signUpController } from "../controllers/authController.js";
import { isAuthenticated } from "../utils/middlewares/authMiddleware.js";

const router = Router()

router.post("/login", signInController)
router.post("/register", signUpController)
router.get("/me", isAuthenticated,  (req, res) => {
    res.status(200).json({ user: req.user,
      success: true
     }); 
  })
  
router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // set to true in production (HTTPS)
    sameSite: "Lax",
  });

  res.status(200).json({ message: "Logged out successfully", success: true });
} )  

export default router