import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUser } from "../interfaces/requestWithUser";
import {
  deductCreditBalanceByUserId,
  getCreditBalanceByUserId,
} from "../app/credit/credit.service";

export async function deductCredit(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (!req.currentUser) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid request!" });
  }

  const creditBalance = await getCreditBalanceByUserId(req.currentUser.id);

  if (creditBalance < 1) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Insufficient balance" });
  }

  await deductCreditBalanceByUserId(req.currentUser.id, 1)
    .then(() => {
      next();
    })
    .catch((error) => {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    });
}
