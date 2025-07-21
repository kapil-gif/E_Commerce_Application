// backend/controllers/location.controller.js
import { insertLocation, getAllLocations } from "../models/location.model.js";

// Save a new location
export const saveLocation = async (req, res) => {
    //console.log("req body : ", req.body);

    try {
        const { name, latitude, longitude } = req.body;
       // console.log(`controller loaction data name ${name} ,latitude :${latitude}, longitude : ${longitude}`);

        if (!name || !latitude || !longitude) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const responceinsert = await insertLocation(name, latitude, longitude);
        if (responceinsert) {
            //console.log("Insert Result responce :", responceinsert);
            res.status(200).json({ success: true, code: 200, message: "Location saved", id: responceinsert.insertId, responce: responceinsert });
        }
    } catch (error) {
        console.log("errr : ", error);
        return res.status(500).json({ message: "Server error" });
    }


};

// Get all locations
export const getLocations = async (req, res) => {
    try {
        const responcegetlocation = await getAllLocations()
        if (responcegetlocation) {
            res.status(200).json({ success: true, code: 200, message: "get Location ", responce: responcegetlocation });
        }

    } catch (error) {
        console.log("error get location  :", error);
        return res.status(500).json({ success: false, code: 500, message: "Server error", error });

    }
};

