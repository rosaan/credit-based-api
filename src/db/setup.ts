import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema";

if (!process.env.DB_URL) {
  throw new Error("DB credentials error");
}

const queryClient = postgres(process.env.DB_URL);

export const db: PostgresJsDatabase<typeof schema> = drizzle(queryClient, {
  schema,
});
