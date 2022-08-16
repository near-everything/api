#!/usr/bin/env -S npx ts-node

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const admin = require('./auth/admin');
const path = require('path');
const token = require("./utils/near/token")
const postgraphile = require("./graphql/postgraphile");

// Load .env variables
require('dotenv').config()

// set up firebase admin for token verification
admin.init();

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

app.post('/create_user', async (req, res) => {
  const username = (
    'elliot.everything.testnet'
  ).toLowerCase();
  const tx = await token.MintNFT(
    6,
    {
      title: "test title",
      description: "test description",
    },
    username
  );
  if (tx) {
    res.send(tx);
  } else {
    res.send("error minting"); // throw exception
  }
})

// Postgraphile must be the last middleware used
app.use(postgraphile.middleware);

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
