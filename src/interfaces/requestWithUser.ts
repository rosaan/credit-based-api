import { user } from "../schema";
import { InferSelectModel } from "drizzle-orm";
import { Request } from "express";

export interface RequestWithUser extends Request {
  currentUser?: InferSelectModel<typeof user>;
}
