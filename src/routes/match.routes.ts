import express from "express";
import { matchService } from "../domain/services/match.service";
import { isAuth } from "../utils/auth.middleware";

// Router propio de usuarios
export const matchRouter = express.Router();

matchRouter.get("/", matchService.getMatches);
matchRouter.get("/:id", matchService.getMatchById);
matchRouter.post("/", isAuth, matchService.createMatch);
matchRouter.delete("/:id", isAuth, matchService.deleteMatch);
matchRouter.put("/:id", isAuth, matchService.updateMatch);
