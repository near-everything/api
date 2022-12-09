import express from 'express';
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Import the Thing controller
import * as thingController from '../controllers/thing.controllers';

// Define a route for creating a new Thing
router.post('/', upload.array("files"), thingController.createThing);

// Define a route for deleting a Thing
router.delete('/:id', thingController.deleteThing);

export default router;