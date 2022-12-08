import express from "express"
import {addAccommodation, getAccommodationById, getAllAccommodations, provideFeedback, updateAccommodation} from "../controllers/accommodation"

const router = express.Router()

router.route("/")
    .post(addAccommodation)
    .get(getAllAccommodations)

router.route("/:id")
    .get(getAccommodationById)
    .patch(updateAccommodation)

router.route("/:id/feedback") //Also includes ratings
    .post(provideFeedback) //Does not list items properly
    .get()


export default router;
