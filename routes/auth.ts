import express, {NextFunction, Request, Response} from "express"

const router = express.Router()
import {signup, login, logout} from "../controllers/auth"

router.route("/signup")
    .post(signup)

router.route("/login")
    .post(login)

router.route("/logout")
    .delete(logout)

export default router

/*
Some middleware I use for responsiveness
(req:Request, res:Response, next:NextFunction) =>{
        console.log("This is working"),
        next()
    },
*/