import express from "express"
import { host } from "../controllers/host";
import { jwtAuth } from "../middleware/jwtAuth";

const router = express.Router()

router.route("/")
    .patch(jwtAuth, host)


export default router;
