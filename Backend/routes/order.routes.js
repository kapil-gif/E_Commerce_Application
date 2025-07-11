import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { comformorder, insertorder, cancleOrder, orderSuccRemoveCart } from "../Controller/Order.controller.js";

const routes = express.Router();


routes.post('/comformOrder', verifyToken, comformorder);
routes.post('/inserdataorder', verifyToken, insertorder);
routes.delete('/cancleorder', verifyToken, cancleOrder);
routes.delete('/orderSucesRemoveCart', verifyToken, orderSuccRemoveCart);





export default routes;














