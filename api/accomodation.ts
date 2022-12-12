import express from "express"
import {addAccommodation, getAccommodationById, getAllAccommodations, provideFeedback, search, updateAccommodation} from "../controllers/accommodation"
import { jwtAuth } from "../middleware/jwtAuth"

const router = express.Router()

router.route("/")
    .post(jwtAuth, addAccommodation)
    .get(getAllAccommodations)
    
router.route("/search")
        .get(search)
        
router.route("/:id")
    .get(getAccommodationById)
    .patch(updateAccommodation)

router.route("/:id/feedback") //Also includes ratings
    .post(provideFeedback) //Does not list items properly
    .get()



export default router;
