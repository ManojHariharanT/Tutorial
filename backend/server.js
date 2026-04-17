import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { WebSocketServer } from "ws";
import { SFLangServer } from "./lsp/SFLangServer.js";
import authRoutes from "./modules/auth/auth.routes.js";
import playgroundRoutes from "./modules/playground/playground.routes.js";
import practiceRoutes from "./modules/practice/practice.routes.js";
import progressRoutes from "./modules/progress/progress.routes.js";
import tutorialRoutes from "./modules/tutorials/tutorial.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { connectDb } from "./utils/connectDb.js";
import { seedInitialData } from "./utils/seedData.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "sf-tutorial-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tutorials", tutorialRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/playground", playgroundRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDb();
    await seedInitialData();

    const server = app.listen(PORT, () => {
      console.log(`SF Tutorial API running on port ${PORT}`);
    });

    const wss = new WebSocketServer({ server, path: "/lsp/sflang" });
    const sfLangServer = new SFLangServer();

    wss.on("connection", (ws) => {
      console.log("LSP Client connected for sflang");
      ws.on("message", (message) => {
        sfLangServer.handleMessage(ws, message);
      });
      ws.on("close", () => {
        console.log("LSP Client disconnected");
      });
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
