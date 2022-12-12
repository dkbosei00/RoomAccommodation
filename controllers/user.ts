import express, {NextFunction, Request, Response} from "express"
import crypto from "crypto"
import brcypt from "bcrypt"
import { verify } from "jsonwebtoken"
import nodemailer from "nodemailer"

const db =require("../sequelize/models")
const DB:any = db
const {Users} = DB

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

// const transport = nodemailer.createTransport({
//     host: 
// })

type verifiedUser = {
    user: {
        id: string
    }
}

export const pwdCheck = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const id = res.locals?.id
        const {oldPassword} = req.body
        const user = await Users.findOne({
            where: {
                id: id
            }
        })
        let pwdComparison = await brcypt.compare(oldPassword, user.password)
        if(pwdComparison){
            next()
        }
    } catch (error) {
        console.log({error: error});
    }
}

export const changePwd = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const {password} = req.body
        const id = res.locals?.id
        let _hash = brcypt.hash(password, 10)
        let newPassword = Users.update({
            password: _hash
        },
        {
            where: {id: id}
        }
        )

        res.status(200).json({
            message: "Password has been successfully changed.",
            hasPasswordChanged: newPassword
        })

        res.redirect("/login")

    } catch (error) {
        console.log({error: error});
        
    }
}

export const editprofile = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const {email, first_name, last_name, phone_number} = req.body  
        const id = res.locals?.id      
        let updateProfile = await Users.update({
            email: email,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number
        },
        {
            where: {id: id}
        }
        )

        res.status(200).json({
            message: "Profile successfully updated.",
            Profile: updateProfile
        })

    } catch (error) {
        console.log({error: error});
        
    }
}

export const forgotPwd = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const resetPasswordToken = crypto.randomBytes(20).toString("hex")
        const resetPasswordExpires = Date.now() + 3600000
    } catch (error) {
        console.log({error: error});
        
    }
}

