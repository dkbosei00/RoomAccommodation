import express, {NextFunction, Request, Response} from "express"

const router = express.Router()
import {signup, login, logout} from "../controllers/auth"

router.route("/signup")
    .post(signup, (req:Request, res:Response, next:NextFunction) =>{
        return res.redirect("/login")
    })

router.route("/login")
    .post(login)
router.route("/logout")
    .delete(logout)

export default router
