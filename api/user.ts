import express from "express"
import { editprofile, forgotPassword, changePassword, resetPassword } from "../controllers/user";
import { jwtAuth } from "../middleware/jwtAuth";

const router = express.Router()

router.route("/forgotPassword")
    .post(forgotPassword)

router.route("/:userId/:token")
    .post(resetPassword)


router.route("/changePassword")
    .post(jwtAuth, changePassword) //Will change after JWT authentication

router.route("/editprofile")
    .patch(jwtAuth, editprofile) //Will change after JWT authentication
    

export default router;
