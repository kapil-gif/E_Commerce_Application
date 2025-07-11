// // routes/dashboard.routes.js
// import express from "express";
// import { adminDashboardHandler, userDashboardHandler } from "../Controller/dashboard.controller.js";
// import { verifyToken } from "../middleware/verifyToken.js";
// import { checkRole } from "../middleware/checkRole.js";

// const router = express.Router();

// router.get("/admin/dashboard", verifyToken, checkRole("admin"), adminDashboardHandler);
// router.get("/dashboard", verifyToken, checkRole("admin", "user"), userDashboardHandler);

// export default router;
