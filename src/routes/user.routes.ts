import express from "express";
import { userService } from "../domain/services/user.service";
import { isAuth } from "../utils/auth.middleware";

// Router propio de usuarios
export const userRouter = express.Router();

userRouter.get("/", userService.getUsers);
userRouter.get("/:id", isAuth, userService.getUserById);
userRouter.post("/register", userService.createUser);
userRouter.delete("/:id", isAuth, userService.deleteUser);
userRouter.put("/:id", isAuth, userService.updateUser);
userRouter.post("/login", userService.login);
