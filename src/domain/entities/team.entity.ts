/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Document, Schema, model } from "mongoose";
import { IUser } from "./user.entity";

export interface ITeamCreate {
  name: string;
  alias: string;
  players: IUser[];
}

export type ITeam = ITeamCreate & Document;

const teamSchema = new Schema<ITeamCreate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    alias: {
      type: String,
      required: false,
      trim: true,
    },
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Team = model<ITeamCreate>("Team", teamSchema);
