import express from "express"
import {addAccommodation, downloadImage, getAccommodationById, getAllAccommodations, getFeedback, provideFeedback, search, updateAccommodation, uploadImage} from "../controllers/accommodation"
import { jwtAuth } from "../middleware/jwtAuth"
import multer from "multer"

const upload = multer({dest: "uploads/"})
const router = express.Router()

router.route("/")
    .post(jwtAuth, addAccommodation)
    .get(getAllAccommodations)
    
router.route("/search")
        .get(search)
        
router.route("/:id")
    .get(getAccommodationById)
    .patch(updateAccommodation)

router.route("/:id/feedback")
    .post(provideFeedback)
    .get(getFeedback)

router.route("/:id/upload")
    .post(upload.single("image"), uploadImage)

router.route("/image/:key")
    .get(downloadImage)

export default router;
