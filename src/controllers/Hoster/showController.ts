import express from "express";
import { Response, Request, NextFunction } from "express";
import { CustomRequest } from "../../middlewares/token-decode";
import hosterDetailsModel from "../../models/Hoster/hosterDetailsModel";
import showModel from "../../models/Hoster/showModel";

export const createShow = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const poster = req.file;
    const {
      name,
      start,
      end,
      time,
      duration,
      age,
      capacity,
      language,
      genres,
      location,
      detail,
      price,
    } = req.body;

    const check = await hosterDetailsModel.findById(userId);
    if (!check) {
      return res.status(400).json({
        status: 400,
        message: "User not found",
        data: "",
      });
    }
    const newShow = new showModel({
      name: name,
      hosterId: userId,
      poster: poster?.path,
      start: start,
      end: end,
      time: time,
      duration: duration,
      age: age,
      capacity: capacity,
      language: language,
      genres: genres.split(","),
      location: location.split(","),
      detail: detail,
      price: price,
    });

    await newShow.save();
    return res.status(200).json({
      status: 200,
      message: "Show added succesfully",
      data: newShow,
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

export const getOwnShow = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const check = await hosterDetailsModel.findById(userId);
    if (!check) {
      return res.status(400).json({
        status: 400,
        message: "User not found",
        data: "",
      });
    }
    const data = await showModel.find({
      hosterId: userId,
    });
    return res.status(200).json({
      status: 200,
      message: "Your Shows",
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
