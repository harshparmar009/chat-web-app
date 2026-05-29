import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
 

import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js";
import sentryMetrics from "./middlewares/sentryMetrics.js";

const app = express();


app.use(Sentry.Handlers.requestHandler());

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//sentry
app.use(sentryMetrics);


// API ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/message", messageRoute);


//  Sentry error handler goes AFTER routes, but BEFORE your custom error handler
Sentry.setupExpressErrorHandler(app);


//custom global error handler (Sends clean JSON to frontend)
app.use((err, req, res, next) => {
  console.error("❌ Error caught by global handler:", err);

  const statusCode = err.status || err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;