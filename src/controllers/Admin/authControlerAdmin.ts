import express from "express";
import { Response, Request, NextFunction } from "express";
import { checkRequiredFields } from "../../helpers/commonValidator";
import adminModel from "../../models/Admin/adminModel";
import { hashPassword } from "../../helpers/hased";
import generateToken from "../../helpers/token";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, mobileNumber } = req.body;
    const requiredFields = [
      "name",
      "email",
      "password",
      "confirmPassword",
      "mobileNumber",
    ];
    const validationError = checkRequiredFields(req.body, requiredFields);
    if (password != confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "password doesn't match",
        data: "",
      });
    }
    const hasedPassword = await hashPassword(String(password));
    const newUser = new adminModel({
      name: name,
      mobileNumber: mobileNumber,
      email: email,
      password: hasedPassword,
    });
    const tokenUser = {
      _id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      mobileNumber: newUser.mobileNumber,
    };
    const token = generateToken(tokenUser);
    await newUser.save();
    return res.status(200).json({
      status: 200,
      message: "Succesfully",
      data: tokenUser,
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
