#!/usr/bin/env -S npx ts-node

const express = require('express');
const { postgraphile } = require('postgraphile');
const cors = require('cors');
const pg = require('pg');
const fs = require('fs');
const config = require('./config.ts');

require('dotenv').config()

const middleware = postgraphile(
  {
    user: process.env.SQL_USERNAME,
    host: process.env.SQL_HOSTNAME,
    database: process.env.SQL_DATABASE,
    password: process.env.SQL_PASSWORD,
    port: process.env.SQL_PORT,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false,
      ca: process.env.CA_CERT
    } : null
  },
  process.env.SQL_DATABASE,
  {
    ...(process.env.NODE_ENV === 'production' ? config.postgraphileOptionsProd : config.postgraphileOptionsDev), appendPlugins: [
      // require("@graphile-contrib/pg-simplify-inflector"), TODO
      require('./plugins/mutations/CreateItemMutationPlugin'),
      require('./plugins/mutations/DeleteItemMutationPlugin'),
      require('./plugins/mutations/RequestItemMutationPlugin'),
      require('./plugins/mutations/ApproveInviteMutationPlugin'),
      require('./plugins/mutations/CreateCategoryMutationPlugin'),
      require('./plugins/mutations/CreateAttributeMutationPlugin')
    ]
  }
);

const app = express();
var whitelist = process.env.CORS_WHITE_LIST || ['http://localhost:3000', 'http://localhost:3010', 'http://localhost:3020', 'http://localhost:3030', 'http://localhost:3040'];
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));

// Postgraphile must be the last middleware used
app.use(middleware);

const server = app.listen(process.env.PORT || 3000, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log("Nice")
  } else {
    const address = server.address();
    if (typeof address !== 'string') {
      const href = `http://localhost:${address.port}/graphiql`;
      console.log(`PostGraphiQL available at ${href} 🚀`);
    } else {
      console.log(`PostGraphile listening on ${address} 🚀`);
    }
  }
});