import dotenv from "dotenv";
// Load enviroment variables
dotenv.config();
import express from "express";
import { connectDB } from "./config/db_connection.config.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";


const app = express();

// Basic Middlewares
app.use(express.json()); // parse JSON Bodies

// Health check route
app.get("/", (req, res) => {
  return res.json({ success: true, message: "Server is Up and Runnig fine" });
});


// My APIS
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


const PORT = process.env.PORT || 5000;

// Start server after DB connection is ready
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[SERVER] Listening on port ${PORT}`);
  });

  // Graceful shutdown of the HTTP server
  const shutdown = async () => {
    console.log("[SERVER] Shutdown initiated");
    server.close(() => {
      console.log("[SERVER] HTTP server closed");
      // let DB SIGINT/SIGTERM handlers close mongoose connection
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer().catch((err) => {
  console.error("[SERVER] Failed to start:", err);
  process.exit(1);
});
