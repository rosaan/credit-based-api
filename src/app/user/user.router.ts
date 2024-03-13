import express from "express";
import { validateData } from "../../middlewares/validateData";
import { userLoginSchema, userRegistrationSchema } from "./zod/schema";

import { registerUser, loginUser, me } from "./user.controller";
import { validateUser } from "../../middlewares/validateUser";

const router = express.Router();

router.post(
  "/register",
  [validateData(userRegistrationSchema.pick({ email: true, password: true }))],
  registerUser
);
router.post(
  "/login",
  [validateData(userLoginSchema.pick({ email: true, password: true }))],
  loginUser
);

router.post("/me", [validateUser], me);

export default router;
