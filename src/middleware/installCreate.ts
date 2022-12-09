// import express, { Express } from "express";
// import { getAuthPgPool } from "./installDatabasePools";
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// export default (app: Express) => {
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));

//   // TODO: Types for request and response
//   app.post('/create', upload.array("files"), async (req, res) => {
//     const { creatorId, privacySetting, characteristics } = req.body;
//     const charArr = JSON.parse(characteristics);
  
//     // Start a sub-transaction
    
//     // create the thing with the creatorId
//     // create and associate the characteristics
//     // create and associate the media
//     // return the thing Id
//     console.log(creatorId);
//     console.log(privacySetting);
//     console.log(charArr[0].attributeId);
//     console.log(charArr[0].optionId);
//     console.log(req.files);
//   });
// };

// async function createThing(pgClient, creatorId, privacySetting) {
//   const {
//     rows: [thing],
//   } = await pgClient.query(
//     `INSERT INTO everything.thing(owner_id, origin_app_id, privacy_type) VALUES ($1, $2, $3)              RETURNING *`,
//     [
//       creatorId,
//       1,
//       privacySetting
//     ]
//   );
//   return thing.id;
// }

// async function createCharacteristic(pgClient, thingId, char) {
//   await pgClient.query(
//     `INSERT INTO everything.characteristic(thing_id, attribute_id, option_id) VALUES ($1, $2, $3)              RETURNING *`,
//     [thingId, char.attributeId, char.optionId]
//   );
// }