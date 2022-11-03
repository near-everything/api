import cors from "cors";
 import { Express } from "express";

 export default (app: Express) => {
   // Enable CORS from all origins 
   app.use(cors({
     "origin": "*",
     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
     "preflightContinue": false,
     "optionsSuccessStatus": 204
   }));
 };