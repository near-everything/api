import { Express, NextFunction, Request, Response } from "express";

export default (app: Express) => {
  const authErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === "UnauthorizedError") {
      console.log(err);
      res.status(err.status).json({ errors: [{ message: err.message }] });
      res.end();
    }
  };
  
  // Apply error handling to the graphql endpoint
  app.use("/graphql", authErrors);
};
