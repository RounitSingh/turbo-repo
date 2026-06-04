import type { CorsOptions } from "cors";

const allowedOrigins = [
  process.env.CORS_ORIGIN ?? "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    const allowed = allowedOrigins.some((o) => origin.startsWith(o.replace(/\/$/, "")));
    callback(allowed ? null : new Error("Not allowed by CORS"), allowed);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
