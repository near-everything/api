import { Express } from "express";
import { auth } from "express-oauth2-jwt-bearer";

export default (app: Express) => {
  app.use("/graphql", auth());
};
