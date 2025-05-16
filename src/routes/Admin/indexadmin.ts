import express from "express";
const router = express.Router();
import auth from "./authRoutes";
import hoster from "./approvRoutes";
// router.get("/", async (req, res) => {
//   res.send("done");
// });
router.use("/auth", auth);
router.use("/approve", hoster);

export default router;
