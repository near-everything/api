#!/usr/bin/env node
import chalk from "chalk";
import { makeApp } from "./app";

require('dotenv').config()

async function main() {

  // Make our application (loading all the middleware, etc)
  const app = await makeApp();

  // And finally, we open the listen port
  const PORT = parseInt(process.env.PORT || "", 10) || 4050;
  const server = app.listen(PORT, () => {
    const address = server.address();
    const actualPort =
      typeof address === "string"
        ? address
        : address && address.port
          ? String(address.port)
          : String(PORT);
    console.log();
    console.log(
      chalk.green(
        `${chalk.bold("everything")} listening on port ${chalk.bold(
          actualPort
        )}`
      )
    );
    console.log();
    console.log(
      `  Site:     ${chalk.bold.underline(`http://localhost:${actualPort}`)}`
    );
    console.log(
      `  GraphiQL: ${chalk.bold.underline(
        `http://localhost:${actualPort}/graphiql`
      )}`
    );
    console.log();
  });
}

main().catch((e) => {
  console.error("Fatal error occurred starting server!");
  console.error(e);
  process.exit(101);
});

