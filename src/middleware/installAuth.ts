import { expressjwt, GetVerificationKey } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { Express } from "express";

export default (app: Express) => {
  // Authentication middleware. When used, the
  // Access Token must exist and be verified against
  // the Auth0 JSON Web Key Set.
  // On successful verification, the payload of the
  // decrypted Access Token is appended to the
  // request (`req`) as a `user` parameter.
  const checkJwt = expressjwt({
    // Dynamically provide a signing key
    // based on the `kid` in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://dev-nhpdvemm.us.auth0.com/.well-known/jwks.json`,
    }) as GetVerificationKey,
    // Validate the audience and the issuer.
    audience: "https://dev-nhpdvemm.us.auth0.com/api/v2/",
    issuer: `https://dev-nhpdvemm.us.auth0.com/`,
    algorithms: ["RS256"],
  });
  // Apply checkJwt to our graphql endpoint
  app.use("/graphql", checkJwt);
};
