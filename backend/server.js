import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import contactRouter from "./routes/contact.js";
import paragraphRouter from "./routes/paragraph.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Fail fast with a clear message instead of signing tokens with `undefined`.
if (!process.env.JWT_SECRET) {
  console.error(
    "FATAL: JWT_SECRET is missing. Add it to backend/.env before starting the server."
  );
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);
app.use(express.json());

// Health check – handy for verifying the server is actually up.
app.get("/api/health", (req, res) =>
  res.json({ success: true, status: "ok", uptime: process.uptime() })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/paragraph", paragraphRouter);
app.use("/api/contact", contactRouter);

// 404 + error handlers must come last
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5008;

// Only listen once the DB is actually connected.
const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();

export default app;
