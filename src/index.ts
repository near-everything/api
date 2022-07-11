#!/usr/bin/env -S npx ts-node

const express = require('express');
const { postgraphile } = require('postgraphile');
const cors = require('cors');
const pg = require('pg');
const fs = require('fs');
const config = require('./config.ts');

// Load .env variables
require('dotenv').config()

// Describe postgraphile connection and configurations
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
    ...(process.env.NODE_ENV === 'production' ? config.postgraphileOptionsProd : config.postgraphileOptionsDev),
    appendPlugins: [
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

// Instantiate express app
const app = express();

// Enable CORS from all origins 
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));

// Postgraphile must be the last middleware used
app.use(middleware);

// Start server
const server = app.listen(process.env.PORT || 4050, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log("everything api started and listening")
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