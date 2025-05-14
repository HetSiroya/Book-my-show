import express, { Request, Response, NextFunction } from "express";
import { signUp } from "../../controllers/User/authControlerUser";

const router = express.Router();

router.post("/signUp", async (req, res, next) => {
  try {
    await signUp(req, res);
  } catch (error) {
    next(error);
  }
});
export default router;
