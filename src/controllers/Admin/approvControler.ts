import { uploadAgreement } from "./../Hoster/authControlerHoster";
import express from "express";
import { Response, Request, NextFunction } from "express";
import adminModel from "../../models/Admin/adminModel";
import { CustomRequest } from "../../middlewares/token-decode";
import hosterDetailsModel from "../../models/Hoster/hosterDetailsModel";
import documnetModel from "../../models/Hoster/documentModel";
import agreementModel from "../../models/Hoster/signAgreement";
import { generatePassword } from "../../helpers/passwordGenerator";
import sendEmail from "../../helpers/sendMail";
import { hashPassword } from "../../helpers/hased";

export const getHoster = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { hosterId } = req.params;
    if (!hosterId) {
      return res.status(400).json({
        status: 400,
        message: "Hoster not provided",
        data: "",
      });
    }
    // hoster details
    const hosterDetails = await hosterDetailsModel.findById(hosterId);
    if (!hosterDetails) {
      return res.status(400).json({
        status: 400,
        message: "Hoster not found",
        data: "",
      });
    }
    // hoster documnet
    const hosterDocument = await documnetModel.findOne({
      hosterId: hosterId,
    });
    // if hoster dont upload the documnet
    if (!hosterDocument) {
      return res.status(400).json({
        status: 400,
        message: "Hoster haven't uploaded the document",
        data: "",
      });
    }
    // hosteragrement
    const hosteragrement = await agreementModel.findOne({
      hosterId: hosterId,
    });

    // if hoster not upload the agreemnet
    if (!hosteragrement) {
      return res.status(400).json({
        status: 400,
        message: "Hoster haven't uploaded the agrement",
        data: "",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "retrived the data",
      data: {
        hosterDetails: hosterDetails,
        hosterDocument: hosterDocument,
        hosteragrement: hosteragrement,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      status: 400,
      message: "somethig Went wrong",
      data: error.message,
    });
  }
};

export const approveHoster = async (req: CustomRequest, res: Response) => {
  try {
    let updateDetails, updateDocument, uploadAgreement;
    let mail;
    const userId = req.user?._id;
    const { hosterId } = req.params;
    const { isVerified } = req.body;
    const password = generatePassword();
    const hasedPassword = await hashPassword(String(password));
    console.log(password);
    const hosterDetails = await hosterDetailsModel.findById(hosterId);
    if (!hosterDetails) {
      return res.status(400).json({
        status: 400,
        message: "Hoster not found",
        data: "",
      });
    }
    // hoster documnet
    const hosterDocument = await documnetModel.findOne({
      hosterId: hosterId,
    });
    // if hoster dont upload the documnet
    if (!hosterDocument) {
      return res.status(400).json({
        status: 400,
        message: "Hoster haven't uploaded the document",
        data: "",
      });
    }
    // hosteragrement
    const hosteragrement = await agreementModel.findOne({
      hosterId: hosterId,
    });
    // if hoster not upload the agreemnet
    if (!hosteragrement) {
      return res.status(400).json({
        status: 400,
        message: "Hoster haven't uploaded the agrement",
        data: "",
      });
    }

    if (isVerified) {
      updateDetails = await hosterDetailsModel.findByIdAndUpdate(
        hosterId,
        {
          isVerified: isVerified,
          passWord: hasedPassword,
        },
        { new: true }
      );
      updateDocument = await documnetModel.findByIdAndUpdate(
        hosterDocument._id,
        {
          isVerified: isVerified,
        },
        { new: true }
      );
      uploadAgreement = await agreementModel.findByIdAndUpdate(
        hosteragrement._id,
        { isVerified: isVerified },
        { new: true }
      );
      mail = sendEmail(
        hosterDetails.email,
        "Your Application Has Been Approved – Welcome to BookMyShow! ",
        `Dear ${hosterDetails.name},

Thank you for your patience.

We are pleased to inform you that your application has been successfully approved. Welcome to BookMyShow!

Below are your login credentials:

Username: ${hosterDetails.mobileNumber}
Password: ${password}

We recommend logging in at your earliest convenience and changing your password for security purposes.

Our team looks forward to working with you. If you have any questions or need assistance, feel free to reach out to us at bd@bookmyshow.com.

Best regards,
${req.user.name}
Business Development Team
BookMyShow`
      );
    } else {
      updateDetails = await hosterDetailsModel.findByIdAndUpdate(
        hosterId,
        {
          isVerified: isVerified,
        },
        { new: true }
      );
      updateDocument = await documnetModel.findByIdAndUpdate(
        hosterDocument._id,
        {
          isVerified: isVerified,
        },
        { new: true }
      );
      uploadAgreement = await agreementModel.findByIdAndUpdate(
        hosteragrement._id,
        { isVerified: isVerified },
        { new: true }
      );
      mail = sendEmail(hosterDetails.email, "Rejected", `Sorry`);
      console.log("mail", mail);
    }
    return res.status(200).json({
      status: 200,
      message: "approved data",
      data: {
        hosterDetails: updateDetails,
        hosterDocument: updateDocument,
        hosteragrement: uploadAgreement,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: "Somethig Went Wrong ",
      data: "",
    });
  }
};
