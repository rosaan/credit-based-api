import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { RequestWithUser } from "../interfaces/requestWithUser";
import { getUserById } from "../app/user/user.service";

export async function validateUser(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;

    if (!decodedToken.id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Unauthorized" });
    }

    await getUserById(decodedToken.id)
      .then((data) => {
        req.currentUser = data;
        next();
      })
      .catch(() => {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Unauthorized" });
      });
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }
}
