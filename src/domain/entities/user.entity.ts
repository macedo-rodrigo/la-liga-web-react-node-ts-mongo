/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Document, Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export enum ROL {
  PLAYER = "PLAYER",
  CAPTAIN = "CAPTAIN",
  ADMIN = "ADMIN",
}

export interface IUserCreate {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: ROL;
  // team?: ITeam;
}

export type IUser = IUserCreate & Document;

const userSchema = new Schema<IUserCreate>(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: (text: string) => validator.isEmail(text),
        message: "invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(ROL),
      default: ROL.PLAYER,
    },
    // team?: ITeam;
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    // Si la contraseña ya estaba encriptada, no la encriptamos de nuevo
    if (this.isModified("password")) {
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
      this.password = passwordEncrypted;
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

export const User = model<IUserCreate>("User", userSchema);
