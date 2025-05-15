import express from "express";
const router = express.Router();
import auth from "./authRoutes";
import hoster from "./approvRoutes"
router.use("/auth", auth);
router.use("/approve", hoster);

export default router;
