/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../../../custom-definitions.d.ts" />

//* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Request, Response, NextFunction } from "express";
import { journeyOdm } from "../odm/journey.odm";

export const getJourneys = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const teams = await journeyOdm.getAllJourneys(page, limit);

    const totalElements = await journeyOdm.getJourneyCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: teams,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getJourneyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userIdToShow = req.params.id;

    // Only for admins and teachers
    if (req.user.role !== "ADMIN" && req.user.role !== "CAPTAIN" && req.user.id !== userIdToShow) {
      res.status(401).json({ error: "You are not authorized to do this" });
      return;
    }

    const journey = await journeyOdm.getJourneyById(userIdToShow);

    if (journey) {
      res.json(journey);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createJourney = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "Hey! Sorry, but you're not allowed to setup a match" });
    }

    const createdJourney = await journeyOdm.createJourney(req.body);
    res.status(201).json(createdJourney);
  } catch (error) {
    next(error);
  }
};

export const deleteJourney = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "It seems like you are not authorized to do this..." });
      return;
    }

    const id = req.params.id;
    const journeyDeleted = await journeyOdm.deleteJourney(id);
    if (journeyDeleted) {
      res.json(journeyDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateJourney = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const journeyToUpdate = await journeyOdm.getJourneyById(id);
    if (journeyToUpdate) {
      Object.assign(journeyToUpdate, req.body);
      const journeySaved: any = await journeyToUpdate.save();
      res.json(journeySaved);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const journeyService = {
  getJourneys,
  getJourneyById,
  createJourney,
  deleteJourney,
  updateJourney,
};
