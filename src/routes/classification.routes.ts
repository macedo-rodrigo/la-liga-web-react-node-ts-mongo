import express from "express";
import { classificationService } from "../domain/services/classification.service";
import { isAuth } from "../utils/auth.middleware";

export const classificationRouter = express.Router();

classificationRouter.get("/", classificationService.getClassification);
classificationRouter.post("/calculate", isAuth, classificationService.calculateClassification);
