import express from "express";
import { getPendingUsers, activateUser, getRoleById } from "../controller/admin.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

// Only admin can view/activate users
router.get("/pending-users", verifyToken, checkRole("admin"), getPendingUsers);
router.put("/activate-user/:id", verifyToken, checkRole("admin"), activateUser);
router.get("/role", verifyToken, getRoleById);

export default router;
