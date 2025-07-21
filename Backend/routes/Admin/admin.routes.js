import express from "express";
import { getPendingUsers, activateUser, Inactiveuser, getRoleById, fetchallusers } from "../../Controller/admin.controller.js";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { checkRole } from "../../middleware/checkRole.js";

const router = express.Router();

router.use(verifyToken, checkRole("admin"));
// Only admin can view/activate users
router.get("/pending-users", verifyToken, checkRole("admin"), getPendingUsers);
router.put("/activate-user/:id", verifyToken, checkRole("admin"), activateUser);
router.put("/inactivate_user", verifyToken, checkRole("admin"), Inactiveuser)
router.get("/role", verifyToken, getRoleById);
router.get('/allusers', verifyToken, fetchallusers);

export default router;
