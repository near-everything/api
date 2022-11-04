import { Express } from "express";
import { Pool } from "pg";

import { getShutdownActions } from "../app";

export function getRootPgPool(app: Express): Pool {
  return app.get("rootPgPool");
}
export function getAuthPgPool(app: Express): Pool {
  return app.get("authPgPool");
}

/**
 * When a PoolClient omits an 'error' event that cannot be caught by a promise
 * chain (e.g. when the PostgreSQL server terminates the link but the client
 * isn't actively being used) the error is raised via the Pool. In Node.js if
 * an 'error' event is raised and it isn't handled, the entire process exits.
 * This NOOP handler avoids this occurring on our pools.
 *
 * TODO: log this to an error reporting service.
 */
function swallowPoolError(_error: Error) {
  /* noop */
}

export default (app: Express) => {
  // This pool runs as the database owner, so it can do anything.
  const rootPgPool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOSTNAME,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT),
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: false,
            ca: process.env.CA_CERT,
          }
        : null,
  });
  rootPgPool.on("error", swallowPoolError);
  app.set("rootPgPool", rootPgPool);

  // This pool runs as the unprivileged user, it's what PostGraphile uses.
  const authPgPool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOSTNAME,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT),
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: false,
            ca: process.env.CA_CERT,
          }
        : null,
  });

  authPgPool.on("error", swallowPoolError);
  app.set("authPgPool", authPgPool);

  const shutdownActions = getShutdownActions(app);
  shutdownActions.push(() => {
    rootPgPool.end();
  });
  shutdownActions.push(() => {
    authPgPool.end();
  });
};
