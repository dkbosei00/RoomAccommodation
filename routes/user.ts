import express from "express"
import { editprofile } from "../controllers/user";

const router = express.Router()

router.route("/reset")
    .post()

router.route("/editprofile")
    .patch(editprofile) //Will change after JWT authentication
    


export default router;
