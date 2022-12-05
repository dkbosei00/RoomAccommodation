import express from "express"

const router = express.Router()

router.route("/reset")
    .post()

router.route("/editprofile")
    .patch()
    


export default router;
