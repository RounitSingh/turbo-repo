import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Request, type Response, type Express } from "express";
import { pool } from "@repo/db";
import { createLogger } from "@repo/logger";
import { corsOptions } from "./config/corsOptions";
import { errorHandler, requestLogger } from "./middlewares";
// import userRouter from "./features/users/routes/user.routes";
  const app: Express = express();
  const log = createLogger("backend");

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.set("trust proxy", 1);
} else {
  app.set("trust proxy", false);
}

app.use(requestLogger);
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.get("/health", (_req: Request, res: Response) => {
 log.info("Health check");
  res.json({ status: "ok", message: "Backend is running" });
});

// app.get("/health/db", async (_req: Request, res: Response) => {
//   try {
//     await pool.query("SELECT 1");
//     res.json({ status: "ok", database: "connected" });
//   } catch {
//     res.status(503).json({ status: "error", message: "Database unavailable" });
//   }
// });

// app.use((req: Request, res: Response) => {
//   res.status(404).json({ message: "404 Not Found", path: req.path });
// });
// app.use(
//   "/api/users",
//   userRouter,
// );

app.use(errorHandler);

export default app;