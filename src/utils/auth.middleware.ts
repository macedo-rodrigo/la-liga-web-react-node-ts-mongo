import { Request, NextFunction, Response } from "express";
import { verifyToken } from "./token";
import { User } from "../domain/entities/user.entity";

export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<null> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("You are not authorized to perform this operation");
    }

    // Descodificamos el token
    const decodedInfo = verifyToken(token);
    const user = await User.findOne({ email: decodedInfo.userEmail }).select("+password");
    if (!user) {
      throw new Error("You are not authorized to perform this operation");
    }

    req.user = {
      id: user.id,
      role: user.role as unknown as CUSTOM_ROL,
    };
    next();

    return null;
  } catch (error) {
    res.status(401).json({ error: "You are not authorized to perform this operation" });
    return null;
  }
};

module.exports = { isAuth };
