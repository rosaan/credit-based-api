import { Response } from "express";
import { RequestWithUser } from "../../interfaces/requestWithUser";
import {
  addCreditBalanceByUserId,
  deductCreditBalanceByUserId,
  getCreditBalanceByUserId,
  refreshCreditBalanceByUserId,
} from "./credit.service";
import { getUserById } from "../user/user.service";

const COST_PER_REQUEST = 1;

export const creditBalance = async (req: RequestWithUser, res: Response) => {
  if (!req.currentUser) {
    return res.status(404).json({ error: "Invalid request!" });
  }

  return await getCreditBalanceByUserId(req.currentUser?.id)
    .then((data) => {
      return res.json({ balance: data });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

export const deductCredit = async (req: RequestWithUser, res: Response) => {
  if (!req.currentUser) {
    return res.status(404).json({ error: "Invalid request!" });
  }

  return await deductCreditBalanceByUserId(
    req.currentUser?.id,
    COST_PER_REQUEST
  )
    .then((data) => {
      return res.json({ message: data });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

export const addCredit = async (req: RequestWithUser, res: Response) => {
  await getUserById(req.body.userId)
    .then(async (data) => {
      if (!data.id) {
        return res.status(404).json({ error: "User does not exist!" });
      }

      return await addCreditBalanceByUserId(req.body.userId, req.body.amount)
        .then((data) => {
          return res.json({ message: data });
        })
        .catch((error) => {
          return res.status(404).json({ error });
        });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

export const refreshCredit = async (req: RequestWithUser, res: Response) => {
  if (!req.currentUser) {
    return res.status(404).json({ error: "Invalid request!" });
  }

  return await refreshCreditBalanceByUserId(req.currentUser?.id)
    .then((data) => {
      return res.json({ balance: data });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};
