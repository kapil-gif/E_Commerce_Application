import express from 'express';
import { createOrder, verify } from "../../Controller/payment.controller.js";
import { verifyToken } from "../../middleware/auth.middleware.js"
import { checkRole } from '../../middleware/checkRole.js';

const router = express.Router();

//router.use(verifyToken, checkRole("customer"));
router.post("/create-order", verifyToken, createOrder);
router.post("/verify", verifyToken, verify);

export default router;
