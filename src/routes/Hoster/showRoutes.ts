import express, { Request, Response, NextFunction } from "express";
import { auth } from "../../middlewares/token-decode";
import { createShow, getOwnShow } from "../../controllers/Hoster/showController";
import { uploadTo } from "../../middlewares/multer";

const router = express.Router();

router.post(
  "/create-show",
  auth,
  uploadTo("event-poster").single("poster"),
  async (req, res, next) => {
    try {
      await createShow(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-show", auth, async (req, res, next) => {
    try {
        await getOwnShow(req , res)
    } catch (error) {
        next(error)
    }
});


export default router;
