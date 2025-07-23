import { Router } from "express";
import { refreshController, signInController, signOutController, signUpController, uploadImageController } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = Router()

router.post("/login", signInController)
router.post("/register", signUpController)
router.get("/refresh", refreshController)
router.put("/update-profile", isAuthenticated, uploadImageController)

router.get("/me", isAuthenticated,  (req, res) => {
    res.status(200).json({ user: req.user,
      success: true
     }); 
  })
  
router.post("/logout", signOutController)  

export default router

