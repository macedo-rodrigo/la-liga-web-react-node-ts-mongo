import { Journey, IJourney, IJourneyCreate } from "../entities/journey.entity";
import { Document } from "mongoose";

const getAllJourneys = async (page: number, limit: number): Promise<IJourney[]> => {
  return await Journey.find()
    .limit(limit)
    .skip((page - 1) * limit);
};

const getJourneyCount = async (): Promise<number> => {
  return await Journey.countDocuments();
};

const getJourneyById = async (id: string): Promise<Document<IJourney> | any> => {
  return await Journey.findById(id).populate("matches");
};

const createJourney = async (journeyData: IJourneyCreate): Promise<Document<IJourney>> => {
  const team = new Journey(journeyData);
  const document: Document<IJourney> = (await team.save()) as any;

  return document;
};

const deleteJourney = async (id: string): Promise<Document<IJourney> | null> => {
  return await Journey.findByIdAndDelete(id);
};

const updateJourney = async (id: string, journeyData: IJourneyCreate): Promise<Document<IJourney> | null> => {
  return await Journey.findByIdAndUpdate(id, journeyData, { new: true, runValidators: true });
};

export const journeyOdm = {
  getAllJourneys,
  getJourneyCount,
  getJourneyById,
  createJourney,
  deleteJourney,
  updateJourney,
};
