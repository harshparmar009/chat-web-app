import { Router } from "express";
import { refreshController, searchQueryController, signInController, signOutController, signUpController, uploadImageController } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

router.post("/login", signInController)
router.post("/register", signUpController)
router.get("/refresh", refreshController)
router.put(
  "/update-profile",
  isAuthenticated,
  upload.single("profilePic"),   // <-- THIS IS CRITICAL
  uploadImageController
);

router.get("/me", isAuthenticated,  (req, res) => {
    res.status(200).json({ user: req.user,
      success: true
     }); 
  })
  
router.post("/logout", signOutController)  

router.get("/search/:userName", searchQueryController)

export default router

