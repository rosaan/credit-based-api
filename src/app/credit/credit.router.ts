import express from "express";

import { validateUser } from "../../middlewares/validateUser";
import {
  addCredit,
  creditBalance,
  deductCredit,
  refreshCredit,
} from "./credit.controller";
import { validateData } from "../../middlewares/validateData";
import { addCreditSchema } from "./zod/schema";
import { validateRole } from "../../middlewares/validateRole";

const router = express.Router();

router.post(
  "/add-credit",
  [validateUser, validateRole("admin"), validateData(addCreditSchema)],
  addCredit
);
router.post("/credit-balance", [validateUser], creditBalance);
router.post("/run-credit", [validateUser, deductCredit], deductCredit);
router.post("/refresh-credit", [validateUser], refreshCredit);

export default router;
