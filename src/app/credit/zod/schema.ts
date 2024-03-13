import { z } from "zod";

export const addCreditSchema = z.object({
  userId: z.number().int().positive(),
  amount: z.number().int().positive(),
});
