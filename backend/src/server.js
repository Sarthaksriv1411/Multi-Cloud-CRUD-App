import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "./app.js";

dotenv.config();

const port = Number(process.env.PORT) || 5050;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task_manager";

let server;

async function startServer() {
  try {
    await mongoose.connect(mongoUri);

    server = app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      await mongoose.connection.close(false);
      process.exit(0);
    });
    return;
  }

  await mongoose.connection.close(false);
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
