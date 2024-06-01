/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Date, Document, Schema, model } from "mongoose";
import { IMatch } from "./match.entity";

export interface IJourneyCreate {
  matches: IMatch[];
  date: Date;
}

export type IJourney = IJourneyCreate & Document;

const journeySchema = new Schema<IJourneyCreate>(
  {
    matches: [{
      type: Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    }],
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Journey = model<IJourneyCreate>("Journey", journeySchema);
