import express, { Request, Response, NextFunction } from "express";
import { auth } from "../../middlewares/token-decode";
import {
  approveHoster,
  approveShow,
  getAllShow,
  getHoster,
} from "../../controllers/Admin/approvController";
import { nextTick } from "process";

const router = express.Router();

// router.get("/", async (req, res) => {
//   res.send("done");
// });

router.get("/getAllShow", auth, async (req, res, next) => {
  try {
    await getAllShow(req, res);
  } catch (error) {
    next(error);
  }
});

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

router.patch("/approveShow/:showId", auth, async (req, res, next) => {
  try {
    await approveShow(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
