import express from "express";
import { Response, Request, NextFunction } from "express";
import { CustomRequest } from "../../middlewares/token-decode";
import hosterDetailsModel from "../../models/Hoster/hosterDetailsModel";

export const crateShow = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const check = await hosterDetailsModel.findById(userId);
    if (!check) {
      return res.status(400).json({
        status: 400,
        message: "User not found",
        data: "",
      });
    }
    
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: "somethig Went wrong",
      data: "",
    });
  }
};
