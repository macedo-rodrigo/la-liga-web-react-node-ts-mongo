import { Request, Response, NextFunction } from "express";
import { Classification, IClassificationCreate } from "../entities/classification.entity";
import { Journey } from "../entities/journey.entity";
import { IMatch } from "../entities/match.entity";
import { Types } from "mongoose";

const calculateClassification = async (): Promise<void> => {
  // Clear the sorting collection before recalculation
  await Classification.deleteMany({});

  // Obtain all the journeys
  const journeys = await Journey.find().populate({
    path: "matches",
    populate: {
      path: "local visitor",
    },
  });

  const classificationMap: Record<string, IClassificationCreate> = {};

  journeys.forEach((journey) => {
    journey.matches.forEach((match: IMatch) => {
      const localId = match.local._id as Types.ObjectId;
      const visitorId = match.visitor._id as Types.ObjectId;

      if (!classificationMap[localId.toString()]) {
        classificationMap[localId.toString()] = {
          team: localId,
          points: 0,
          won: 0,
          lost: 0,
        };
      }
      if (!classificationMap[visitorId.toString()]) {
        classificationMap[visitorId.toString()] = {
          team: visitorId,
          points: 0,
          won: 0,
          lost: 0,
        };
      }

      if (match.localScore > match.visitorScore) {
        classificationMap[localId.toString()].points += 3;
        classificationMap[localId.toString()].won += 1;
        classificationMap[visitorId.toString()].lost += 1;
      } else if (match.localScore < match.visitorScore) {
        classificationMap[visitorId.toString()].points += 3;
        classificationMap[visitorId.toString()].won += 1;
        classificationMap[localId.toString()].lost += 1;
      } else {
        classificationMap[localId.toString()].points += 1;
        classificationMap[visitorId.toString()].points += 1;
      }
    });
  });

  const classificationArray = Object.values(classificationMap);

  await Classification.insertMany(classificationArray);
};

export const getClassification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classification = await Classification.find().populate("team").sort({ points: -1, won: -1, lost: 1 }).limit(10);

    res.json(classification);
  } catch (error) {
    next(error);
  }
};

export const classificationService = {
  calculateClassification,
  getClassification,
};
