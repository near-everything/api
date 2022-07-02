#!/usr/bin/env -S npx ts-node
const express = require('express');
const { postgraphile } = require('postgraphile');
const cors = require('cors');

const middleware = postgraphile(
  process.env.DATABASE_URL || "postgres://postgres:changeme@localhost:5432/everything",
  "everything",
  {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    enableCors: true,
    appendPlugins: [require('./CreateItemMutationPlugin')]
  }
);

const app = express();

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));

// Postgraphile must be the last middleware used
app.use(middleware);

const server = app.listen(process.env.PORT || 3000, () => {
  const address = server.address();
  if (typeof address !== 'string') {
    const href = `http://localhost:${address.port}/graphiql`;
    console.log(`PostGraphiQL available at ${href} 🚀`);
  } else {
    console.log(`PostGraphile listening on ${address} 🚀`);
  }
});