/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../../../custom-definitions.d.ts" />

//* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Request, Response, NextFunction } from "express";
import { matchOdm } from "../odm/match.odm";

export const getMatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const teams = await matchOdm.getAllMatches(page, limit);

    const totalElements = await matchOdm.getMatchCount();

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

export const getMatchById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userIdToShow = req.params.id;

    // Only for admins and teachers
    if (req.user.role !== "ADMIN" && req.user.role !== "CAPTAIN" && req.user.id !== userIdToShow) {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const match = await matchOdm.getMatchById(userIdToShow);

    if (match) {
      res.json(match);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role !== "ADMIN") {
      res.status(201).json({ error: "Hey! Sorry, but you're not allowed to setup a match" });
    }

    const createdMatch = await matchOdm.createMatch(req.body);
    res.status(201).json(createdMatch);
  } catch (error) {
    next(error);
  }
};

export const deleteMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "It seems like you are not authorized to do this..." });
      return;
    }

    const id = req.params.id;
    const matchDeleted = await matchOdm.deleteMatch(id);
    if (matchDeleted) {
      res.json(matchDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const matchToUpdate = await matchOdm.getMatchById(id);
    if (matchToUpdate) {
      Object.assign(matchToUpdate, req.body);
      const matchSaved: any = await matchToUpdate.save();
      res.json(matchSaved);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const matchService = {
  getMatches,
  getMatchById,
  createMatch,
  deleteMatch,
  updateMatch,
};
