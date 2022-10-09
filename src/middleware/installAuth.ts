// import { expressjwt, GetVerificationKey } from "express-jwt";
// import jwksRsa from "jwks-rsa";
import { Express } from "express";
import { auth } from "express-oauth2-jwt-bearer";

export default (app: Express) => {
  // app.use((req, res, next) => {
  //   console.log(req.headers.authorization)
  //   next()
  // });
  // app.use("/graphql", auth());
};
