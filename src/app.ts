import express, { Express } from "express";

import * as middleware from "./middleware";
import { makeShutdownActions, ShutdownAction } from "./shutdownActions";
import { sanitizeEnv } from "./utils";

export function getShutdownActions(app: Express): ShutdownAction[] {
  return app.get("shutdownActions");
}

export async function makeApp(): Promise<Express> {
  /*
   * Check that necessary env variables have all been provided
   */
  sanitizeEnv();

  const isTest = process.env.NODE_ENV === "test";
  const isDev = process.env.NODE_ENV === "development";

  const shutdownActions = makeShutdownActions();

  if (isDev) {
    shutdownActions.push(() => {
      require("inspector").close();
    });
  }

  /*
   * Express server
   */
  const app = express();

  /*
   * For a clean nodemon shutdown, we need to close all our sockets otherwise
   * we might not come up cleanly again (inside nodemon).
   */
  app.set("shutdownActions", shutdownActions);

  /*
   * Middleware is installed from the /server/middleware directory. These
   * helpers may augment the express app with new settings and/or install
   * express middleware. These helpers may be asynchronous, but they should
   * operate very rapidly to enable quick as possible server startup.
   */
  await middleware.installAuthErrorHandler(app);
  await middleware.installAuth(app);
  await middleware.installCors(app);
  await middleware.installDatabasePools(app);
  // await middleware.installWorkerUtils(app);
  // await middleware.installHelmet(app);
  // await middleware.installSameOrigin(app);
  // await middleware.installCSRFProtection(app);
  await middleware.installLogging(app);
  // if (process.env.FORCE_SSL) {
  //   await middleware.installForceSSL(app);
  // }
  // if (isTest || isDev) {
  //   await middleware.installCypressServerCommand(app);
  // }
  await middleware.installPostGraphile(app);

  /*
   * Error handling middleware
   */
  // await middleware.installErrorHandler(app);

  return app;
}
