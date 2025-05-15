import express from "express";
import { Response, Request, NextFunction } from "express";
import { checkRequiredFields } from "../../helpers/commonValidator";
import hosterDetailsModel from "../../models/Hoster/hosterDetailsModel";
import { comparePassword, hashPassword } from "../../helpers/hased";
import generateToken from "../../helpers/token";
import verifyModel from "../../models/Hoster/verifyModel";
import otpGenerator from "otp-generator";
import { CustomRequest } from "../../middlewares/token-decode";
import documnetModel from "../../models/Hoster/documentModel";
import agreementModel from "../../models/Hoster/signAgreement";

const otp = otpGenerator.generate(6, {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
  digits: true,
});

export const register = async (req: Request, res: Response) => {
  try {
    const {
      Name,
      Pancard,
      Address,
      Return,
      State,
      FullName,
      Email,
      MobileNumber,
      AccountOwner,
      AccountType,
      bankName,
      accountNumber,
      IFSC,
    } = req.body;

    const requiredFields = [
      "Name",
      "Pancard",
      "Address",
      "Return",
      "State",
      "FullName",
      "Email",
      "MobileNumber",
      "AccountOwner",
      "AccountType",
      "bankName",
      "accountNumber",
      "IFSC",
    ];
    const validationError = checkRequiredFields(req.body, requiredFields);
    const check = await verifyModel.findOne({
      mobileNumber: MobileNumber,
      isVerified: true,
    });
    if (!check) {
      return res.status(400).json({
        status: 400,
        message: "not allowed",
        data: "",
      });
    }
    const exist = await hosterDetailsModel.findOne({
      email: Email,
    });
    console.log("exist", !exist);

    if (exist) {
      return res.status(400).json({
        status: 400,
        message: "already exist",
        data: "",
      });
    }
    const newUser = new hosterDetailsModel({
      name: Name,
      pancard: Pancard,
      address: Address,
      return: Return,
      state: State,
      fullName: FullName,
      email: Email,
      mobileNumber: MobileNumber,
      accountOwner: AccountOwner,
      accountType: AccountType,
      bankName: bankName,
      accountNumber: accountNumber,
      ifsc: IFSC,
    });
    console.log("newUser", newUser);

    const tokenUser = {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      mobileNumber: newUser.mobileNumber,
    };
    const token = generateToken(tokenUser);
    await newUser.save();
    return res.status(200).json({
      status: 200,
      message: "Succesfully",
      data: newUser,
      token: token,
    });
  } catch (e: any) {
    console.log("Error", e.message);
    return res.status(400).json({
      status: 400,
      message: "somethig Went wrong",
      data: "",
    });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const { mobileNumber } = req.params;
    const { otp } = req.body;
    const exist = await verifyModel.findOne({
      mobileNumber: mobileNumber,
      otp: otp,
    });
    if (!exist) {
      return res.status(404).json({
        status: 404,
        meassage: "otp not match",
      });
    }
    await verifyModel.findByIdAndUpdate(
      exist._id,
      {
        isVerified: true,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      status: 200,
      message: "verified",
    });
  } catch (e: any) {
    console.log("Error", e.message);
    return res.status(400).json({
      status: 400,
      message: "somethig Went wrong",
      data: "",
    });
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  const { mobileNumber } = req.body;
  const newUser = new verifyModel({
    mobileNumber: mobileNumber,
    otp: otp,
  });
  await newUser.save();
  return res.status(200).json({
    status: 200,
    message: "otp sent",
    data: newUser,
  });
};

export const uploadDocumnet = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;
    const userExist = await hosterDetailsModel.findOne({
      _id: user._id,
    });
    if (!userExist) {
      return res.status(400).json({
        status: 400,
        message: "User dot exist",
        data: "",
      });
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log("req.files", files);

    const panCardPath = files["pancard"]?.[0]?.path;
    const chequePath = files["cheque"]?.[0]?.path;
    const exist = await documnetModel.findOne({
      hosterId: user?._id,
    });
    console.log("exist", exist);
    if (exist) {
      return res.status(400).json({
        status: 400,
        message: "already uploaded",
        data: "",
      });
    }
    const newData = new documnetModel({
      hosterId: user?._id,
      pancard: panCardPath,
      cheques: chequePath,
    });
    await newData.save();
    return res.status(200).json({
      status: 200,
      message: "done upoload",
      data: "",
    });
  } catch (error: any) {
    console.log("Error", error.message);
    return res.status(400).json({
      status: 400,
      message: "somethig Went wrong",
      data: "",
    });
  }
};

export const uploadAgreement = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const agreement = req.file;
    if (!agreement) {
      return res.status(400).json({
        status: 400,
        message: "File not uploadesd",
        data: "",
      });
    }
    const userExist = await hosterDetailsModel.findOne({
      _id: userId,
    });
    if (!userExist) {
      return res.status(400).json({
        status: 400,
        message: "User dot exist",
        data: "",
      });
    }
    const exist = await agreementModel.findOne({
      hosterId: userId,
    });
    console.log("exist", exist);
    if (exist) {
      return res.status(400).json({
        status: 400,
        message: "already uploaded",
        data: "",
      });
    }
    const newAgreement = new agreementModel({
      hosterId: userId,
      agreement: agreement.path,
    });
    await newAgreement.save();
    return res.status(200).json({
      status: 200,
      message: "Uploaded Succefully",
      data: newAgreement,
    });
  } catch (error: any) {
    console.log("Error", error.message);
    return res.status(400).json({
      status: 400,
      message: "somethig Went wrong",
      data: "",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { mobileNumber, password } = req.body;
    const requiredFields = ["mobileNumber", "password"];
    const validationError = checkRequiredFields(req.body, requiredFields);
    const user = await hosterDetailsModel.findOne({
      mobileNumber: mobileNumber,
      isVerified: true,
    });
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "Please Sign Up",
        data: "",
      });
    }
    const check = comparePassword(String(password), String(user.passWord));
    if (!check) {
      return res.status(400).json({
        status: 400,
        message: "Password not match",
        data: "",
      });
    }
    const tokenUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      mobileNumber: user.mobileNumber,
    };
    const token = generateToken(tokenUser);
    return res.status(200).json({
      status: 200,
      message: "Login Succesfully",
      data: user,
      token: token,
      
    });
  } catch (error: any) {
    console.log("Error", error.message);
    return res.status(400).json({
      status: 400,
      message: "somethig Went wrong",
      data: "",
    });
  }
};
