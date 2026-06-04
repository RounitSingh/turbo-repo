import "dotenv/config";
import { createServer } from "http";
import app from "./app";
import { createLogger } from "@repo/logger";
import { connectToDatabase } from "@repo/db";
const log = createLogger("backend");
const PORT = (process.env.PORT) || 5050;

const httpServer = createServer(app);

(async () => {
  log.info("Initializing exam-attendance system...");

  try {
    await connectToDatabase();

    httpServer.listen(PORT, () => {
      log.info(`Backend running on http://localhost:${PORT} 🚀`);
      log.info(`Environment: ${process.env.NODE_ENV || "development"}`);
      log.debug("Press Ctrl+C to stop the application. 🛑");
    });
  } catch (error) {
    log.error("Failed to start the application ⚠️", { error });
    process.exit(1);
  }
})();
