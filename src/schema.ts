import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").$type<"admin" | "user">().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transaction = pgTable("transaction", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => user.id),
  amount: serial("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
