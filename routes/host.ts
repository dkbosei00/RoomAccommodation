import express from "express"
import { host } from "../controllers/host";
import { adminAuth } from "../middleware/jwtAuth";

const router = express.Router()

router.route("/")
    .patch(adminAuth, host)


export default router;
