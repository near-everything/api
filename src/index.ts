#!/usr/bin/env -S npx ts-node

const express = require('express');
const { postgraphile } = require('postgraphile');
const cors = require('cors');
const pg = require('pg');
const fs = require('fs');
const config = require('./config.ts');
const admin = require('firebase-admin');
const path = require('path');

// Load .env variables
require('dotenv').config()

const serviceAccount =
  process.env.NODE_ENV === 'production' ? JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG || "") : require("../everything-dev-pk.json") || "";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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
      require("@graphile-contrib/pg-simplify-inflector"),
      require('./plugins/mutations/CreateItemMutationPlugin'),
      require('./plugins/mutations/ApproveInviteMutationPlugin'),
      // require('./plugins/mutations/CreateCategoryMutationPlugin'),
      require('./plugins/mutations/CreateAttributeMutationPlugin'),
      require('./plugins/mutations/ProposeAttributeMutationPlugin'),
      require('./plugins/mutations/ProposeOptionMutationPlugin'),
      require('./plugins/mutations/CreateUserMutationPlugin')
    ],
    pgSettings: async (req) => {
      if (process.env.NODE_ENV === 'production') {
        if (req.headers.authorization === undefined) {
          return {
            role: 'everything_anon'
          }
        } else {
          const token = req.headers.authorization.split('Bearer ')[1];
          const decodedToken = await admin.auth().verifyIdToken(token);
          // can check role, configure this role with database
          return {
            role: 'everything_user',
            'jwt.claims.firebase.id': decodedToken.uid
          };
        }
      }
    }
  }
);

// Instantiate express app
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS from all origins 
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));

// app.use(checkAuth)

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
