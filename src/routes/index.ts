import express, { type NextFunction, type Response, type Request, type ErrorRequestHandler } from "express";
import { mongoConnect } from "../domain/repositories/mongo-repository";
import { userRouter } from "./user.routes";
import { teamRouter } from "./team.routes";
import { matchRouter } from "./match.routes";
import { journeyRouter } from "./journey.routes";
import { classificationRouter } from "./classification.routes";

export const configureRoutes = (app: any): any => {
  // Routes
  const router = express.Router();

  // Middleware for connecting to Mongo
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    await mongoConnect();
    next();
  });

  router.get("/", (req: Request, res: Response) => {
    res.send(`
      <h3>This is my La Liga API's main page.</h3>
    `);
  });

  router.get("*", (req: Request, res: Response) => {
    res.status(404).send("Oops! We have not found the requested page.");
  });

  // Usamos las rutas
  app.use("/public", express.static("public"));
  app.use("/user", userRouter);
  app.use("/team", teamRouter);
  app.use("/match", matchRouter);
  app.use("/journey", journeyRouter);
  app.use("/api/classification", classificationRouter);
  app.use("/", router);

  // Middleware de gestión de errores
  app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log("*** ERROR STARTS ***");
    console.log(`FAILED REQUEST: ${req.method} to the URL ${req.originalUrl}`);
    console.log(err);
    console.log("*** ERROR ENDS ***");

    // Truco para quitar el tipo a una variable
    const errorAsAny: any = err as unknown as any;

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else if (errorAsAny.errmsg && errorAsAny.errmsg?.indexOf("duplicate key") !== -1) {
      res.status(400).json({ error: errorAsAny.errmsg });
    } else if (errorAsAny?.code === "ER_NO_DEFAULT_FOR_FIELD") {
      res.status(400).json({ error: errorAsAny?.sqlMessage });
    } else {
      res.status(500).json(err);
    }
  });

  return app;
};
