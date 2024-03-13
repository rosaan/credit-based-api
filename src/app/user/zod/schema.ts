import { user } from "../../../schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const userRegistrationSchema = createInsertSchema(user, {
  email: (schema) => schema.email.email(),
  password: (schema) => schema.password.min(8),
});

export const userLoginSchema = createSelectSchema(user, {
  email: (schema) => schema.email.email(),
  password: (schema) => schema.password,
});
