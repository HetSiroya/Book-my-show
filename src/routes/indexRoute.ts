import express from "express";
const router = express.Router();
import admin from "./Admin/indexadmin";
import user from "./User/indexUser";
import hoster from "./Hoster/indexhoster";
// router.get("/", (req, res) => {
//   res.send("done");
// });

router.use("/Admin", admin);
router.use("/User", user);
router.use("/Hoster", hoster);

export default router;
