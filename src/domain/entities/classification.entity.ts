import { Document, Schema, model, Types } from "mongoose";

export interface IClassificationCreate {
  team: Types.ObjectId; // Cambiar a Types.ObjectId
  points: number;
  won: number;
  lost: number;
}

export type IClassification = IClassificationCreate & Document;

const classificationSchema = new Schema<IClassificationCreate>(
  {
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    won: {
      type: Number,
      required: true,
      default: 0,
    },
    lost: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Classification = model<IClassificationCreate>("Classification", classificationSchema);
