import express from "express"
import { book, editBook } from "../controllers/requests"
import { basicAuth, hostAuth } from "../middleware/jwtAuth"

const router = express.Router()

router.route("/")
    .post(book)

router.route("/:id")
    .patch(editBook)

router.route("/:id/comment")
    .post(basicAuth,)

router.route("/:id/approve")
    .get(hostAuth,)

router.route("/:id/reject")
    .get(hostAuth,)


export default router;
