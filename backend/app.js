// backend/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js"

const app = express();

const corsOpt = {
    origin: "https://chat-web-app-two-delta.vercel.app",
    // methods: ["GET", "POST"],
    credentials: true
}

//middlewares
app.use(cors(corsOpt));
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser());

//API ROUTES
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/message", messageRoute)

// Error handler
// app.use(errorHandler);

export default app;
