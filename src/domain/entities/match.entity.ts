/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Date, Document, Schema, model } from "mongoose";
import { ITeam } from "./team.entity";

export interface IMatchCreate {
  local: ITeam;
  visitor: ITeam;
  date: Date;
  localScore: number;
  visitorScore: number;
  winner: ITeam;
}

export type IMatch = IMatchCreate & Document;

const matchSchema = new Schema<IMatchCreate>(
  {
    local: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      trim: true,
    },
    visitor: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    localScore: {
      type: Number,
      required: false,
    },
    visitorScore: {
      type: Number,
      required: false,
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Match = model<IMatchCreate>("Match", matchSchema);
