import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { profileupdate } from "../Controller/profile.controller.js"
import { searchbotton } from "../Controller/search.controller.js"
const routes = express.Router();

routes.get('/fetchprofile', verifyToken, profileupdate);
routes.get('/searchCategory', verifyToken, searchbotton);




export default routes;








