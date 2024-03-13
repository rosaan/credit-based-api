import { Request, Response } from "express";
import { RequestWithUser } from "../../interfaces/requestWithUser";
import { createUser, getUserToken } from "./user.service";

export const registerUser = async (req: Request, res: Response) => {
  return await createUser(req.body)
    .then((data) => {
      return res.json(data);
    })
    .catch((error) => {
      if (error === "User already exists") {
        return res.status(400).json({ error });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    });
};

export const loginUser = async (req: Request, res: Response) => {
  return await getUserToken(req.body)
    .then((data) => {
      return res.json(data);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

export const me = async (req: RequestWithUser, res: Response) => {
  return res.json({ email: req.currentUser?.email });
};
