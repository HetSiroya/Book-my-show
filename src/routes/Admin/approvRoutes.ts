import express, { Request, Response, NextFunction } from "express";
import { auth } from "../../middlewares/token-decode";
import {
  approveHoster,
  getHoster,
} from "../../controllers/Admin/approvControler";

const router = express.Router();

router.get("/getHoster/:hosterId", auth, async (req, res, next) => {
  try {
    await getHoster(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/approveHoster/:hosterId", auth, async (req, res, next) => {
  try {
    await approveHoster(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
