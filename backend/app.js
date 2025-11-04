// backend/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js"

const app = express();

// const corsOpt = {
//     origin: "https://chat-web-app-two-delta.vercel.app",
//     // methods: ["GET", "POST"],
//     credentials: true
// }

const allowedOrigins = [
    "https://chat-web-3pmtj9zkv-hardins-projects-4071acd0.vercel.app", // your current frontend
    "https://chat-web-app-two-delta.vercel.app", // optional (keep if you might reuse)
    "http://localhost:5173" // for local development
  ];
  

//middlewares
// app.use(cors(corsOpt));
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }));
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser());

//API ROUTES
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/message", messageRoute)

// Error handler
// app.use(errorHandler);

export default app;
