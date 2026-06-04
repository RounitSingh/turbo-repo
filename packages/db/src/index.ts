import "dotenv/config";
import pg, { type PoolClient } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { createLogger } from "@repo/logger";
import * as schema from "./schema";

const log = createLogger("backend");

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema,
  casing: "snake_case",
});

pool.on("connect", async (client: PoolClient) => {
  await client.query(`SET TIME ZONE 'UTC'`);
  log.debug("New DB connection established, timezone set to UTC");
});

export const connectToDatabase = async (): Promise<void> => {
  try {
    const client: PoolClient = await pool.connect();
    log.info("Connected to the database successfully");
    client.release();
  } catch (error) {
    log.error("Failed to connect to the database", { error });
    process.exit(1);
  }
};

export { schema };
export * from "./schema/index";
export * from "./dto/user.dto";
