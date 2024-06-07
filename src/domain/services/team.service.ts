/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../../../custom-definitions.d.ts" />

//* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Request, Response, NextFunction } from "express";
import { teamOdm } from "../odm/team.odm";

export const getTeams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Ternario que se queda con el parametro si llega
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const teams = await teamOdm.getAllTeams(page, limit);

    // Num total de elementos
    const totalElements = await teamOdm.getTeamCount();

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

export const getTeamById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userIdToShow = req.params.id;
    console.log(req.user);

    // Only for admins and captains
    if (req.user.role !== "ADMIN" && req.user.role !== "CAPTAIN" && req.user.team.toString() !== userIdToShow) {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const team = await teamOdm.getTeamById(userIdToShow);

    if (team) {
      const temporalTeam = team.toObject();
      res.json(temporalTeam);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role !== "ADMIN") {
      res.status(201).json({ error: "Sorry, you're not allowed to create a team" });
    }

    const createdTeam = await teamOdm.createTeam(req.body);
    res.status(201).json(createdTeam);
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const teamDeleted = await teamOdm.deleteTeam(id);
    if (teamDeleted) {
      res.json(teamDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userIdToShow = req.params.id;
    // Only for admins
    if (req.user.role !== "ADMIN" && req.user.role !== userIdToShow) {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const teamToUpdate = await teamOdm.getTeamById(id);
    if (teamToUpdate) {
      Object.assign(teamToUpdate, req.body);
      const teamSaved: any = await teamToUpdate.save();
      res.json(teamSaved);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const getMatchesByTeamId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const teamId = req.params.id;
    const matches = await teamOdm.getMatchesByTeamId(teamId);

    if (matches) {
      res.json(matches);
    } else {
      res.status(404).json({ error: "No matches found" });
    }
  } catch (error) {
    next(error);
  }
};

export const teamService = {
  getTeams,
  getTeamById,
  createTeam,
  deleteTeam,
  updateTeam,
  getMatchesByTeamId
};
