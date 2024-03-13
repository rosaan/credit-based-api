import { RequestWithUser } from "../interfaces/requestWithUser";
import { Response, NextFunction } from "express";

export function validateRole(role: "admin" | "user") {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (req.currentUser?.role === role) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  };
}
