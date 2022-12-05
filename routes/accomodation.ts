import express from "express"

const router = express.Router()

router.route("/")
    .post()
    .get()

router.route("/:id")
    .get()

router.route("/:id/rooms")
    .post()
    .get()

router.route("/:id/rooms/:id")
    .get()

router.route("/:id/feedback")
    .post()


export default router;
