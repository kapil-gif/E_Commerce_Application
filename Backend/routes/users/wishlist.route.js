import express from "express";
import { AddtoWishlist, removewishlist, fetchwishlist, fetchorderdetials } from "../../Controller/wishlist.controller.js"
import { verifyToken } from "../../middleware/auth.middleware.js";
import { checkRole } from "../../middleware/checkRole.js";

const routes = express.Router();

routes.use(verifyToken, checkRole("customer"));
routes.post('/addtowishlist', verifyToken, AddtoWishlist);
routes.delete('/removeproductwishlist', verifyToken, removewishlist);
routes.get('/fetchwishlist', verifyToken, fetchwishlist);
routes.get('/fetchOrderProductdetails', verifyToken, fetchorderdetials);
export default routes;



