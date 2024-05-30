/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { Mongoose, connect } from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const DB_CONNECTION: string = process.env.DB_URL as string;
const DB_NAME: string = process.env.DB_NAME as string;

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  dbName: DB_NAME,
};

export const mongoConnect = async (): Promise<Mongoose | null> => {
  try {
    const database: Mongoose = await connect(DB_CONNECTION, config);
    const { name, host } = database.connection;
    console.log(`Connected to database ${name} on host ${host}`);

    return database;
  } catch (error) {
    console.error(error);
    console.log("Error in the connection, trying to connect in 5s...");
    setTimeout(mongoConnect, 5000);

    return null;
  }
};
