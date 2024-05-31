import { Match, IMatch, IMatchCreate } from "../entities/match.entity";
import { Document } from "mongoose";

const getAllMatches = async (page: number, limit: number): Promise<IMatch[]> => {
  return await Match.find()
    .limit(limit)
    .skip((page - 1) * limit);
};

const getMatchCount = async (): Promise<number> => {
  return await Match.countDocuments();
};

const getMatchById = async (id: string): Promise<Document<IMatch> | any> => {
  return await Match.findById(id).populate("local", "visitor", "winner");
};

const createMatch = async (matchData: IMatchCreate): Promise<Document<IMatch>> => {
  const team = new Match(matchData);
  const document: Document<IMatch> = (await team.save()) as any;

  return document;
};

const deleteMatch = async (id: string): Promise<Document<IMatch> | null> => {
  return await Match.findByIdAndDelete(id);
};

const updateMatch = async (id: string, matchData: IMatchCreate): Promise<Document<IMatch> | null> => {
  return await Match.findByIdAndUpdate(id, matchData, { new: true, runValidators: true });
};

export const matchOdm = {
  getAllMatches,
  getMatchCount,
  getMatchById,
  createMatch,
  deleteMatch,
  updateMatch,
};
