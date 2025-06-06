import multer from "multer";
import path from "path";
const fs = require("fs");

const createMulterStorage = (folderName: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join("public", "uploads", folderName);
      console.log("uploadpath", uploadPath);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.fieldname + "-" + file.originalname);
    },
  });

export const uploadTo = (folderName: string) =>
  multer({
    storage: createMulterStorage(folderName),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Invalid file type. Only JPG, PNG and PDF files are allowed"
          )
        );
      }
    },
  });
