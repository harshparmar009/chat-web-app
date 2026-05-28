import { Router } from "express";
import { generateFcmToken, refreshController, searchQueryController, signInController, signOutController, signUpController, uploadImageController } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import multer from "multer";
import * as Sentry from "@sentry/node";


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

router.post("/register-token", isAuthenticated, generateFcmToken);

router.get("/me", isAuthenticated,  (req, res) => {
    res.status(200).json({ user: req.user,
      success: true
     }); 
  })
  
router.post("/logout", signOutController)  

router.get("/search/:userName", searchQueryController)


//sentry catch error test route

// router.get("/sentry", (req, res) => {
//   try {
//     throw new Error("Sentry test error ");
//   } catch (error) {
//     Sentry.captureException(error);

//     res.status(500).json({
//       success: false,
//       message: "Testing sentry error capture"
//     });
//   }
// });

export default router

