import express from "express";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { addnewproduct } from "../../Controller/addNewProduct.controller.js"
import { upload } from "../../middleware/multerFileUpload.util.js";
import { checkRole } from "../../middleware/checkRole.js"
const routes = express.Router();

routes.use(verifyToken, checkRole("admin"));
routes.post('/newproduct', verifyToken, upload, addnewproduct);









export default routes;


