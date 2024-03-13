import { runMigration } from "../db/migrate";
import postgres from "postgres";
import { afterAll, beforeAll } from "vitest";
import jwt from "jsonwebtoken";
import { createUser, setRole } from "../app/user/user.service";

const sql = postgres("", {
  max: 1,
  username: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "postgres",
});

const databaseName = "credit_test";

beforeAll(async (a) => {
  await sql`DROP DATABASE IF EXISTS ${sql(databaseName)} WITH (FORCE);`;
  await sql`CREATE DATABASE ${sql(databaseName)};`;
  await runMigration().then(() => {
    console.log("Migrated database");
  });

  await sql.end();

  await seed();

  // @ts-ignore
  global.adminToken = jwt.sign({ id: 1 }, process.env.TOKEN_SECRET as string, {
    expiresIn: "1h",
  });

  // @ts-ignore
  global.userToken = jwt.sign({ id: 2 }, process.env.TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  // @ts-ignore
  delete global.userToken;
  // @ts-ignore
  delete global.adminToken;
});

const seed = async () => {
  const userList = [
    {
      email: "admin@admin.com",
      password: "password",
    },
    {
      email: "rosaan@rosaan.com",
      password: "password",
    },
  ];

  for (const user of userList) {
    await createUser(user).catch((error) => {
      console.log("Error from test setup:", error);
    });
  }

  setRole("admin@admin.com", "admin");
};
