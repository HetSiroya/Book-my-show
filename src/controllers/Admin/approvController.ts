import { uploadAgreement } from "../Hoster/authControllerHoster";
import express from "express";
import { Response, Request, NextFunction } from "express";
import adminModel from "../../models/Admin/adminModel";
import { CustomRequest } from "../../middlewares/token-decode";
import hosterDetailsModel from "../../models/Hoster/hosterDetailsModel";
import documnetModel from "../../models/Hoster/documentModel";
import agreementModel from "../../models/Hoster/signAgreementModel";
import { generatePassword } from "../../helpers/passwordGenerator";
import sendEmail from "../../helpers/sendMail";
import { hashPassword } from "../../helpers/hased";
import showModel from "../../models/Hoster/showModel";

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

export const getAllShow = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const check = await adminModel.findById(userId);
    const { status } = req.body;
    if (!check) {
      return res.status(400).json({
        status: 400,
        message: "User not found",
        data: "",
      });
    }
    const data = await showModel.find();
    return res.status(200).json({
      status: 200,
      message: "All Show",
      data: data,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({
      status: 400,
      message: "somethig Went wrong",
      data: "",
    });
  }
};

export const approveShow = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { showId } = req.params;
    const { action } = req.body;
    console.log("action", action);

    const userExist = await adminModel.findById(userId);
    if (!userExist) {
      return res.status(400).json({
        status: 400,
        message: "user dont exist ",
        data: "",
      });
    }
    const showExist = await showModel.findById(showId);
    if (!showExist) {
      return res.status(400).json({
        status: 400,
        message: "show dont exist ",
        data: "",
      });
    }
    const show = await showModel.findByIdAndUpdate(
      showId,
      {
        status: action,
      },
      {
        new: true,
      }
    );

    const hoster = await hosterDetailsModel.findById(show?.hosterId);
    if (!hoster) {
      return res.status(400).json({
        status: 400,
        message: "user dont exist ",
        data: "",
      });
    }
    if (action == "approved") {
      sendEmail(
        hoster?.email,
        `Approval Confirmation for ${showExist.name}`,
        `Dear sir/mam,

Thank you for sending over the approval for ${showExist.name}. We have reviewed the details and are pleased to confirm our approval as well.

We appreciate your prompt coordination and look forward to moving ahead with the preparations. Please let us know the next steps or if any additional input is required from our side.

Best regards
BookMyShow
`
      );
    }

    if (action == "rejected") {
      console.log("rejected");

      sendEmail(
        hoster?.email,
        "Show Proposal – Regretfully Declined",
        `Dear Sir\Mam,

Thank you for submitting the proposal for ${showExist.name}. We appreciate the time and effort your team has put into preparing the details.

After careful consideration, we regret to inform you that we will not be moving forward with the approval for this show. This decision was made based on [brief reason, if appropriate—e.g., scheduling conflicts, budget constraints, alignment with current priorities, etc.].

We value your interest and hope to have the opportunity to collaborate on future projects. Please don’t hesitate to reach out with any new proposals or ideas.

Wishing you all the best.`
      );
    }

    return res.status(200).json({
      status: 200,
      message: "Show added succesfully",
      data: show,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({
      status: 400,
      message: "somethig Went wrong",
      data: "",
    });
  }
};
