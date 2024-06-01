import express from "express";
import { journeyService } from "../domain/services/journey.service";
import { isAuth } from "../utils/auth.middleware";

export const journeyRouter = express.Router();

journeyRouter.get("/", journeyService.getJourneys);
journeyRouter.get("/:id", journeyService.getJourneyById);
journeyRouter.post("/", isAuth, journeyService.createJourney);
journeyRouter.delete("/:id", isAuth, journeyService.deleteJourney);
journeyRouter.put("/:id", isAuth, journeyService.updateJourney);
