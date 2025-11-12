require("dotenv").config();
import { Express, Request, Response, NextFunction } from "express";
import { testDbConnection } from "./config/database";
import path from "path";
import authRoutes from "./routes/AuthRoutes";
import userRoutes from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";
import submissionRoutes from "./routes/submissionRoutes";
import commentRoutes from "./routes/commentRoutes";
import reviewRoutes from "./routes/ReviewRoutes";
import { errorHandler } from "./middleware/errorHandler";

const express = require("express");

const app: Express = express();

app.use(express.json());
// serve static asset from public
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api", reviewRoutes);

app.get("/", (req, res) => {
  req: Request;
  res: Response;
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Error handler middleware (must be after all routes)
app.use(errorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

testDbConnection();
