#!/usr/bin/env -S npx ts-node
const express = require('express');
const { postgraphile } = require('postgraphile');
const cors = require('cors');
const pg = require('pg');
const fs = require('fs');

require('dotenv').config()

const middleware = postgraphile(
  new pg.Pool({
    user: process.env.SQL_USERNAME,
    host: process.env.SQL_HOSTNAME,
    database: process.env.SQL_DATABASE,
    password: process.env.SQL_PASSWORD,
    port: process.env.SQL_PORT,
    ssl: {
      rejectUnauthorized: true,
      ca:
        process.env.NODE_ENV === 'production'
          ? process.env.CA_CERT
          : fs.readFileSync("ca_certificate.crt").toString(),
    },
  }),
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