import express from "express"
import { editprofile, pwdCheck, changePwd, forgotPwd } from "../controllers/user";
import { jwtAuth } from "../middleware/jwtAuth";

const router = express.Router()

router.route("/forgotPassword")
    .post(forgotPwd)


router.route("/changePassword")
    .post(jwtAuth, pwdCheck, changePwd) //Will change after JWT authentication

router.route("/editprofile")
    .patch(jwtAuth, editprofile) //Will change after JWT authentication
    

export default router;
