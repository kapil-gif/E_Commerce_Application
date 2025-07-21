import express from "express";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { profileupdate } from "../../Controller/profile.controller.js"
import { searchbotton } from "../../Controller/search.controller.js"
import { checkRole } from "../../middleware/checkRole.js";
const routes = express.Router();

routes.get('/searchCategory', verifyToken, checkRole("customer", "admin"), searchbotton);
routes.use(verifyToken, checkRole("customer"));

routes.get('/fetchprofile', verifyToken, profileupdate);





export default routes;








