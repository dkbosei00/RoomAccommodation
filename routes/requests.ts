import express from "express"

const router = express.Router()

router.route("/")
    .post()

router.route("/:id")
    .patch()

router.route("/:id/comment")
    .post()

router.route("/:id/approve")
    .get()

router.route("/:id/reject")
    .get()


export default router;
