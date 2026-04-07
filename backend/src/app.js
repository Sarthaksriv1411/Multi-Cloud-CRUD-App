import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";

import taskRoutes from "./routes/taskRoutes.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN ||
  "http://localhost:5173,http://localhost:8080")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    }
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_request, response) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  response.json({
    status: mongoose.connection.readyState === 1 ? "ok" : "degraded",
    database: states[mongoose.connection.readyState] || "unknown",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/tasks", taskRoutes);

app.use((request, response) => {
  response.status(404).json({
    message: `Route not found: ${request.method} ${request.originalUrl}`
  });
});

app.use((error, _request, response, _next) => {
  if (error.name === "ValidationError") {
    response.status(400).json({ message: error.message });
    return;
  }

  if (error.name === "CastError") {
    response.status(400).json({ message: "Invalid task identifier." });
    return;
  }

  response.status(error.statusCode || 500).json({
    message: error.message || "Unexpected server error."
  });
});

export default app;
