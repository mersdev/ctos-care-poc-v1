import express from "express";
import * as dotenv from "dotenv";
import { corsMiddleware } from "./middleware/cors";
import profileRoutes from "./routes/profileRoutes";
import authRoutes from "./routes/authRoutes";
import { runMigrations } from "./utils/migration";
import pool from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(corsMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);

async function startServer() {
  try {
    // Run database migrations
    await runMigrations();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
