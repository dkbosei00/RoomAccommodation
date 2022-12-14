import express from "express"
import { editprofile, forgotPwd, changePassword } from "../controllers/user";
import { jwtAuth } from "../middleware/jwtAuth";

const router = express.Router()

router.route("/forgotPassword")
    .post(forgotPwd)


router.route("/changePassword")
    .post(jwtAuth, changePassword) //Will change after JWT authentication

router.route("/editprofile")
    .patch(jwtAuth, editprofile) //Will change after JWT authentication
    

export default router;
