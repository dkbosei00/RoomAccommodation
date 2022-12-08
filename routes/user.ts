import express from "express"
import { editprofile, pwdCheck, changePwd, forgotPwd } from "../controllers/user";

const router = express.Router()

router.route("/forgotPassword")
    .post(forgotPwd)


router.route("/changePassword")
    .post(pwdCheck, changePwd) //Will change after JWT authentication

router.route("/editprofile")
    .patch(editprofile) //Will change after JWT authentication
    
router.route("/search")
    .get()

export default router;
