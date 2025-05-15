import express, { Request, Response, NextFunction } from "express";
import {
  login,
  register,
  sendOtp,
  uploadAgreement,
  uploadDocumnet,
  verify,
} from "../../controllers/Hoster/authControlerHoster";
import { nextTick } from "process";
import { uploadTo } from "../../middlewares/multer";
import { auth } from "../../middlewares/token-decode";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    await register(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/send-otp", async (req, res, next) => {
  try {
    await sendOtp(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/verify/:mobileNumber", async (req, res, next) => {
  try {
    await verify(req, res);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/upload-documnet",
  uploadTo("Documnet").fields([
    { name: "pancard", maxCount: 1 },
    { name: "cheque", maxCount: 1 },
  ]),
  auth,
  async (req, res, next) => {
    try {
      await uploadDocumnet(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/upload-sign-agreement",
  auth,
  uploadTo("sign-agreement").single("sign-agreement"),
  async (req, res, next) => {
    try {
      await uploadAgreement(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/login", async (req, res, next) => {
  try {
    await login(req, res);
  } catch (error) {
    next(error);
  }
});
export default router;
