#!/usr/bin/env -S npx ts-node
const express = require('express');
const { postgraphile } = require('postgraphile');
const cors = require('cors');

require('dotenv').config()

const middleware = postgraphile(
  `postgres://${process.env.SQL_USERNAME}:${process.env.SQL_PASSWORD}@${process.env.SQL_URL}:${process.env.SQL_PORT}/everything?sslmode=require` || "postgres://postgres:changeme@localhost:5432/everything",
  "everything",
  {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    enableCors: true,
    appendPlugins: [
      require('./plugins/mutations/CreateItemMutationPlugin'),
      require('./plugins/mutations/RequestItemMutationPlugin'),
      require('./plugins/mutations/ApproveInviteMutationPlugin')
    ]
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