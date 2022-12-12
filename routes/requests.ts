import express from "express"
import { approve, book, editBook, reject } from "../controllers/requests"
import { jwtAuth } from "../middleware/jwtAuth"

const router = express.Router()

router.route("/")
    .post(book)

router.route("/:id")
    .patch(editBook)

router.route("/:id/comment")
    .post(jwtAuth,)

router.route("/:id/approve")
    .get(jwtAuth, approve)

router.route("/:id/reject")
    .get(jwtAuth, reject)


export default router;
