import { IMatch, Match } from "../entities/match.entity";
import { Team, ITeam, ITeamCreate } from "../entities/team.entity";
import { Document } from "mongoose";

const getAllTeams = async (page: number, limit: number): Promise<ITeam[]> => {
  return await Team.find()
    .limit(limit)
    .skip((page - 1) * limit);
};

const getTeamCount = async (): Promise<number> => {
  return await Team.countDocuments();
};

const getTeamById = async (id: string): Promise<Document<ITeam> | any> => {
  return await Team.findById(id).populate(["players"]);
};

const createTeam = async (teamData: ITeamCreate): Promise<Document<ITeam>> => {
  const team = new Team(teamData);
  const document: Document<ITeam> = (await team.save()) as any;

  return document;
};

const deleteTeam = async (id: string): Promise<Document<ITeam> | null> => {
  return await Team.findByIdAndDelete(id);
};

const updateTeam = async (id: string, teamData: ITeamCreate): Promise<Document<ITeam> | null> => {
  return await Team.findByIdAndUpdate(id, teamData, { new: true, runValidators: true });
};

const getMatchesByTeamId = async (teamId: string): Promise<IMatch[]> => {
  return await Match.find({
    $or: [{ local: teamId }, { visitor: teamId }]
  }).populate(["local", "visitor"]);
};

export const teamOdm = {
  getAllTeams,
  getTeamCount,
  getTeamById,
  createTeam,
  deleteTeam,
  updateTeam,
  getMatchesByTeamId
};
