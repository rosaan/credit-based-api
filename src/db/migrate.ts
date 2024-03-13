import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export const runMigration = async () => {
  if (!process.env.DB_URL) {
    throw new Error("DB credentials error");
  }

  const pg = postgres(process.env.DB_URL, {
    max: 1,
    debug: process.env.NODE_ENV === "development",
  });

  const db = drizzle(pg, {
    logger: process.env.NODE_ENV === "development",
  });
  await migrate(db, { migrationsFolder: "migrations" });

  pg.end();
};

runMigration();
