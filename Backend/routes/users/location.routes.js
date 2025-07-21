// backend/routes/location.routes.js
import express from "express";
import { saveLocation, getLocations } from "../../Controller/location.controller.js";

const router = express.Router();

router.post("/save_location", saveLocation);   // Save a new location
router.get("/get_locations", getLocations);   // Get all saved locations

export default router;
