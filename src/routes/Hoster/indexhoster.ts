import express from "express";
const router = express.Router();
import auth from "./authRoutes";
import show from "./showRoutes";

router.use("/auth", auth);
router.use("/show", show);

export default router;
