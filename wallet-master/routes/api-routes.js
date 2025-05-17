import { verify } from "../middleware/middleware.js";
import express from "express";
import { generateAddress } from "../controller/address-controller.js";

const route = express.Router();

//Health Check 
route.get("/test", (_req, res) => {
    res.send("Test route is working!");
});

// api Routes
route.post("/generateAddress", verify,generateAddress);

export default route;